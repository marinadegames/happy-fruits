import { instantiate, Node, Prefab, Vec3 } from 'cc';
import { Combo } from 'db://assets/scripts/ecs/components/Combo';
import { Health } from 'db://assets/scripts/ecs/components/Health';
import { UILabel } from 'db://assets/scripts/ecs/components/UILabel';
import { Entity } from 'db://assets/scripts/ecs/Entity';
import { System } from 'db://assets/scripts/ecs/System';
import { AnimationSystem } from 'db://assets/scripts/ecs/systems/AnimationSystem';
import { ParticleSystem } from 'db://assets/scripts/ecs/systems/ParticleSystem';
import { SoundSystem } from 'db://assets/scripts/ecs/systems/SoundSystem';
import { SoundName, TypeOfLabel } from 'db://assets/scripts/types';

import { Collider } from '../components/Collider';
import { Fruit } from '../components/Fruit';
import { PlayerControlled } from '../components/PlayerControlled';
import { Score } from '../components/Score';
import { View } from '../components/View';
import { World } from '../World';

function isIntersect(aPos: Vec3, aSize: Collider, bPos: Vec3, bSize: Collider): boolean {
    const ax1 = aPos.x - aSize.width / 2;
    const ax2 = aPos.x + aSize.width / 2;
    const ay1 = aPos.y;
    const ay2 = aPos.y + aSize.height;

    const bx1 = bPos.x - bSize.width / 2;
    const bx2 = bPos.x + bSize.width / 2;
    const by1 = bPos.y;
    const by2 = bPos.y + bSize.height;

    return !(ax2 < bx1 || ax1 > bx2 || ay2 < by1 || ay1 > by2);
}

export class CatchSystem extends System {
    public floatingScoreLabelPrefab: Prefab | null = null;

    update(world: World): void {
        const fruits = world.entities.filter((e) => e.hasComponent(Fruit));
        const baskets = world.entities.filter((e) => e.hasComponent(PlayerControlled));

        for (const basket of baskets) {
            this.checkBasketCollisions(world, basket, fruits);
        }
    }

    private checkBasketCollisions(world: World, basket: Entity, fruits: Entity[]) {
        const basketView = basket.getComponent(View)!;
        const basketCol = basket.getComponent(Collider)!;
        const basketPos = basketView.node.getPosition();

        for (const fruit of fruits) {
            const fruitView = fruit.getComponent(View)!;
            const fruitCol = fruit.getComponent(Collider)!;
            const fruitPos = fruitView.node.getPosition();

            if (isIntersect(fruitPos, fruitCol, basketPos, basketCol)) {
                this.handleCatch(world, basket, fruit, fruitView.node.parent!, fruitPos);
            }
        }
    }

    private handleCatch(world: World, basket: Entity, fruit: Entity, parent: Node, fruitPos: Vec3) {
        const fruitView = fruit.getComponent(View)!;
        fruitView.node.destroy();
        world.entities.splice(world.entities.indexOf(fruit), 1);

        const soundSystem = world.getSystem(SoundSystem);
        const isDangerous = fruit.getComponent(Fruit).isDangerous;
        const score = basket.getComponent(Score);
        const combo = basket.getComponent(Combo);

        if (!score) return;

        if (isDangerous) {
            const particleSystem = world.getSystem(ParticleSystem);
            soundSystem?.play(SoundName.CATCH_BAD_FRUIT, false, 1);
            particleSystem?.explode(fruit);
            particleSystem?.stopFireAtLabel();
            combo?.reset();
            this.loseLife(world, basket);
            this.showFloatingScore(world, parent, fruitPos, '-❤️');
            this.updateBonusLabel(world, combo);

            return;
        }

        combo?.increment();

        if (combo?.isCombo()) {
            score.bonusIncrement();
            this.showFloatingScore(world, parent, fruitPos, '+5 🎉');
            this.updateBonusLabel(world, combo);
            soundSystem?.play(SoundName.BONUS, false, 1);
        } else {
            score.bonusIncrement();
            score.increment();
            this.showFloatingScore(world, parent, fruitPos, '+1');
            this.updateBonusLabel(world, combo);
        }

        this.updateScoreLabel(world, score);
        world.getSystem(AnimationSystem)?.hitAnimation(basket);
        soundSystem?.play(SoundName.CATCH_GOOD_FRUIT, false, 1);
    }

    private showFloatingScore(world: World, parentNode: Node, position: Vec3, text: string) {
        if (!this.floatingScoreLabelPrefab) return;
        const floatingLabelNode = instantiate(this.floatingScoreLabelPrefab);
        floatingLabelNode.setPosition(position);
        parentNode.addChild(floatingLabelNode);

        world.getSystem(AnimationSystem)?.showFloatingScore(floatingLabelNode, text);
    }

    private loseLife(world: World, basket: Entity) {
        const health = basket.getComponent(Health);
        health.loseLife();

        const animSystem = world.getSystem(AnimationSystem);
        const healthEntity = world.entities.find(
            (e) => e.getComponent(UILabel)?.type === TypeOfLabel.HEALTH
        );

        if (animSystem && healthEntity) {
            const label = healthEntity.getComponent(UILabel)!.label;
            label.string = `LIVES: ${health.value > 0 ? '🤍'.repeat(health.value) : '💀'}`;
            animSystem.labelAnimation(label);
            animSystem.damageFlash(basket);
        }
    }

    private updateScoreLabel(world: World, score: Score) {
        const animSystem = world.getSystem(AnimationSystem);
        const scoreEntity = world.entities.find(
            (e) => e.getComponent(UILabel)?.type === TypeOfLabel.SCORE
        );

        if (animSystem && scoreEntity) {
            const label = scoreEntity.getComponent(UILabel)!.label;
            label.string = `SCORE: ${score.value}`;
            animSystem.labelAnimation(label);
        }
    }

    private updateBonusLabel(world: World, combo: Combo) {
        const animSystem = world.getSystem(AnimationSystem);
        const bonusEntity = world.entities.find(
            (e) => e.getComponent(UILabel)?.type === TypeOfLabel.BONUS
        );

        if (animSystem && bonusEntity) {
            const label = bonusEntity.getComponent(UILabel)!.label;
            label.string = `BONUS: ${combo.count}`;
            animSystem.labelAnimation(label);

            if (combo.isCombo()) {
                world.getSystem(ParticleSystem)?.fireAtLabel(label);
            }
        }
    }
}
