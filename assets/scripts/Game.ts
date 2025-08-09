import {
    _decorator,
    AudioClip,
    Button,
    Component,
    instantiate,
    Label,
    Node,
    Prefab,
    Sprite,
    Vec3,
} from 'cc';
import { World } from './ecs/World';
import { Entity } from './ecs/Entity';
import { MovementSystem } from './ecs/systems/MovementSystem';
import { PlayerInputSystem } from './ecs/systems/PlayerInputSystem';
import { FruitSpawnSystem } from './ecs/systems/FruitSpawnSystem';
import { CatchSystem } from './ecs/systems/CatchSystem';
import { TimerSystem } from './ecs/systems/TimerSystem';

import { View } from './ecs/components/View';
import { PlayerControlled } from './ecs/components/PlayerControlled';
import { Collider } from './ecs/components/Collider';
import { Score } from './ecs/components/Score';
import { Timer } from './ecs/components/Timer';
import { Health } from './ecs/components/Health';

import {
    AllDangerousFruitsType,
    AllFruitsType,
    FruitPrefabElements,
    SoundName,
    TypeOfDangerousFruit,
    TypeOfFruit,
    TypeOfLabel,
} from './types';
import { ZigzagMovementSystem } from 'db://assets/scripts/ecs/systems/ZigzagMovementSystem';
import { AnimationSystem } from 'db://assets/scripts/ecs/systems/AnimationSystem';
import { UILabel } from 'db://assets/scripts/ecs/components/UILabel';
import { ParticleSystem } from 'db://assets/scripts/ecs/systems/ParticleSystem';
import { Combo } from 'db://assets/scripts/ecs/components/Combo';
import { SoundSystem } from 'db://assets/scripts/ecs/systems/SoundSystem';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    private world: World = new World();
    private isGameOver: boolean = false;

    @property({ type: Prefab }) basketPrefab: Prefab = null!;
    @property({ type: [Prefab] }) fruitPrefabsArray: Prefab[] = [];
    @property({ type: [Prefab] }) dangerousFruitsPrefabsArray: Prefab[] = [];
    @property({ type: Prefab }) explodeParticlePrefab: Prefab = null!;
    @property({ type: Prefab }) fireParticle: Prefab = null!;
    @property({ type: Prefab }) floatingScoreLabelPrefab: Prefab = null!;
    @property({ type: Label }) scoreLabel: Label = null!;
    @property({ type: Label }) bonusLabel: Label = null!;
    @property({ type: Label }) timerLabel: Label = null!;
    @property({ type: Label }) healthLabel: Label = null!;
    @property({ type: Button }) restartButton: Button = null!;
    @property({ type: Label }) gameResultLabel: Label = null!;
    @property({ type: Sprite }) redDisplay: Sprite = null!;
    @property({ type: [AudioClip] }) gameSounds: AudioClip[] = [];

    start() {
        this.isGameOver = false;
        this.redDisplay.node.active = false;
        this.restartButton.node.active = false;
        this.gameResultLabel.node.active = false;

        this.world = new World();
        this.initSystems();
        this.createBasket();
        this.createUILabels();

        this.world.getSystem(SoundSystem);
    }

    private initSystems(): void {
        this.world.addSystem(new MovementSystem());
        this.world.addSystem(new PlayerInputSystem());

        const fruitPrefabs: FruitPrefabElements<TypeOfFruit>[] = this.fruitPrefabsArray.map(
            (prefab, i) => ({ type: AllFruitsType[i], prefab })
        );
        const dangerousFruitPrefabs: FruitPrefabElements<TypeOfDangerousFruit>[] =
            this.dangerousFruitsPrefabsArray.map((prefab, i) => ({
                type: AllDangerousFruitsType[i],
                prefab,
            }));
        this.world.addSystem(new FruitSpawnSystem(fruitPrefabs, dangerousFruitPrefabs, this.node));

        this.world.addSystem(new TimerSystem());
        this.world.addSystem(new ZigzagMovementSystem());
        this.world.addSystem(new AnimationSystem());

        const particleSystem = new ParticleSystem();
        particleSystem.explodeParticlePrefab = this.explodeParticlePrefab;
        particleSystem.fireLabelParticle = this.fireParticle;
        this.world.addSystem(particleSystem);

        const catchSystem = new CatchSystem();
        catchSystem.floatingScoreLabelPrefab = this.floatingScoreLabelPrefab;
        this.world.addSystem(catchSystem);

        const soundSystem = new SoundSystem(this.gameSounds);
        this.world.addSystem(soundSystem);

        soundSystem.play(SoundName.BACKGROUND, true, 1);
    }

    private createBasket(): void {
        const basketNode: Node = instantiate(this.basketPrefab);
        basketNode.setPosition(new Vec3(0, -300));
        this.node.addChild(basketNode);

        const basket: Entity = new Entity()
            .addComponent(new View(basketNode))
            .addComponent(new PlayerControlled())
            .addComponent(Collider.fromNode(basketNode))
            .addComponent(new Score(0))
            .addComponent(new Timer(30))
            .addComponent(new Health(3))
            .addComponent(new Combo());

        this.world.addEntity(basket);
    }

    private createUILabels(): void {
        this.scoreLabel.string = 'SCORE: 0';
        this.world.addEntity(
            new Entity().addComponent(new UILabel(this.scoreLabel, TypeOfLabel.SCORE))
        );

        this.healthLabel.string = 'LIVES: 🤍🤍🤍️';
        this.world.addEntity(
            new Entity().addComponent(new UILabel(this.healthLabel, TypeOfLabel.HEALTH))
        );

        this.bonusLabel.string = 'BONUS: 0';
        this.world.addEntity(
            new Entity().addComponent(new UILabel(this.bonusLabel, TypeOfLabel.BONUS))
        );
    }

    update(dt: number): void {
        if (this.isGameOver) return;

        this.world.update(dt);

        const basket: Entity = this.world.entities.find((e) => e.hasComponent(PlayerControlled));
        if (!basket) return;

        const lives: Health = basket.getComponent(Health);
        const timer: Timer = basket.getComponent(Timer);

        if (lives?.isDead()) {
            this.endGame(false);
        }

        if (timer) {
            this.timerLabel.string = `TIMER: ${Math.ceil(timer.remaining)}`;
            if (timer.isFinished) {
                this.endGame(true);
            }
        }
    }

    private endGame(fromTimer: boolean): void {
        if (this.isGameOver) return;
        this.isGameOver = true;

        for (const entity of this.world.entities) {
            const view: View = entity.getComponent(View);
            if (view?.node?.isValid) {
                view.node.destroy();
            }
        }

        const soundSystem = this.world.getSystem(SoundSystem);
        soundSystem?.stop(SoundName.BACKGROUND);
        soundSystem?.play(fromTimer ? SoundName.WIN : SoundName.LOSE, false, 1);

        const particleSystem: ParticleSystem = this.world.getSystem(ParticleSystem);
        particleSystem.stopFireAtLabel();
        this.world.clear();

        this.redDisplay.node.active = true;
        this.gameResultLabel.node.active = true;
        this.gameResultLabel.string = fromTimer ? 'YOU WIN!' : 'GAME OVER!';
        this.restartButton.node.active = true;
    }

    restartGame() {
        this.node.removeAllChildren();
        this.start();
    }
}
