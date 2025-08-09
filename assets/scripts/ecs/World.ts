import { Entity } from './Entity';
import { System } from './System';

export class World {
    entities: Entity[] = [];
    systems: System[] = [];

    addEntity(entity: Entity): this {
        this.entities.push(entity);
        return this;
    }

    addSystem(system: System): this {
        this.systems.push(system);
        return this;
    }

    getSystem<T extends System>(systemClass: new (...args: never[]) => T): T | undefined {
        return this.systems.find((s) => s instanceof systemClass) as T | undefined;
    }

    update(deltaTime: number): void {
        for (const system of this.systems) {
            system.update(this, deltaTime);
        }
    }

    clear() {
        this.entities = [];
        this.systems = [];
    }
}
