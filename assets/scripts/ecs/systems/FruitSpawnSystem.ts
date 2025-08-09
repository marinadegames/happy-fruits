import { instantiate, Node, Prefab, Vec3, view } from 'cc';
import { System } from 'db://assets/scripts/ecs/System';

import { Collider } from '../components/Collider';
import { Fruit } from '../components/Fruit';
import { Velocity } from '../components/Velocity';
import { View } from '../components/View';
import { ZigzagMotion } from '../components/ZigzagMotion';
import { Entity } from '../Entity';
import { World } from '../World';

interface FruitPrefabEntry {
    type: string;
    prefab: Prefab;
}

export class FruitSpawnSystem extends System {
    private spawnTimer = 0;

    constructor(
        private fruitPrefabs: FruitPrefabEntry[],
        private dangerousPrefabs: FruitPrefabEntry[],
        private rootNode: Node
    ) {
        super();
    }

    update(world: World, deltaTime: number): void {
        this.spawnTimer -= deltaTime;

        if (this.spawnTimer <= 0) {
            this.spawnFruit(world);
            this.spawnTimer = this.getNextSpawnDelay();
        }
    }

    private spawnFruit(world: World): void {
        const isDangerous = Math.random() < 0.2; // 20% chance
        const prefabEntry = this.getRandomPrefab(isDangerous);

        const fruitNode = instantiate(prefabEntry.prefab);
        fruitNode.setPosition(this.getSpawnPosition());
        this.rootNode.addChild(fruitNode);

        const fruitEntity = new Entity()
            .addComponent(new View(fruitNode))
            .addComponent(new Fruit(prefabEntry.type, isDangerous))
            .addComponent(new Velocity(0, this.getRandomFallSpeed()))
            .addComponent(Collider.fromNode(fruitNode));

        if (this.shouldAddZigzag()) {
            fruitEntity.addComponent(this.createZigzagMotion(fruitNode));
        }

        world.addEntity(fruitEntity);
    }

    private getRandomPrefab(isDangerous: boolean): FruitPrefabEntry {
        const source = isDangerous ? this.dangerousPrefabs : this.fruitPrefabs;
        const index = Math.floor(Math.random() * source.length);
        return source[index];
    }

    private getSpawnPosition(): Vec3 {
        const screenSize = view.getVisibleSize();
        const halfWidth = screenSize.width / 2;
        const x = Math.random() * screenSize.width - halfWidth;
        const y = screenSize.height / 2 + 25;
        return new Vec3(x, y, 0);
    }

    private getRandomFallSpeed(): number {
        return -(Math.random() * 100 + 150);
    }

    private shouldAddZigzag(): boolean {
        return Math.random() < 0.35; // 35% chance
    }

    private createZigzagMotion(node: Node): ZigzagMotion {
        return new ZigzagMotion(
            50 + Math.random() * 50,
            0.2 + Math.random(),
            node.position.x,
            node.position.y
        );
    }

    private getNextSpawnDelay(): number {
        return Math.random() * 1.5;
    }
}
