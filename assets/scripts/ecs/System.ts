import { World } from 'db://assets/scripts/ecs/World';

import { Entity } from './Entity';

export abstract class System {
    abstract update(world: World, deltaTime: number): void;

    protected query<T>(world: World, predicate: (entity: Entity) => boolean): Entity[] {
        return world.entities.filter(predicate);
    }
}
