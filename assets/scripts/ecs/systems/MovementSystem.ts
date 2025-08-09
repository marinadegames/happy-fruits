import { View } from 'db://assets/scripts/ecs/components/View';
import { System } from 'db://assets/scripts/ecs/System';

import { Velocity } from '../components/Velocity';
import { World } from '../World';

export class MovementSystem extends System {
    constructor() {
        super();
    }

    update(world: World, deltaTime: number): void {
        for (const entity of world.entities) {
            const view = entity.getComponent(View);
            const velocity = entity.getComponent(Velocity);

            if (view && velocity) {
                const pos = view.node.getPosition();

                view.node.setPosition(
                    pos.x + velocity.vx * deltaTime,
                    pos.y + velocity.vy * deltaTime
                );
            }
        }
    }
}
