import { Velocity } from 'db://assets/scripts/ecs/components/Velocity';
import { System } from 'db://assets/scripts/ecs/System';
import { World } from 'db://assets/scripts/ecs/World';

import { View } from '../components/View';
import { ZigzagMotion } from '../components/ZigzagMotion';

export class ZigzagMovementSystem extends System {
    update(world: World, dt: number): void {
        const entities = world.entities.filter(
            (e) => e.hasComponent(View) && e.hasComponent(ZigzagMotion)
        );

        for (const entity of entities) {
            const view = entity.getComponent(View)!;
            const zigzag = entity.getComponent(ZigzagMotion)!;

            zigzag.time += dt;

            view.node.setPosition(
                zigzag.basePosition.x +
                    zigzag.amplitude * Math.sin(zigzag.time * zigzag.frequency * 2 * Math.PI),
                zigzag.basePosition.y -
                    zigzag.time * Math.abs(entity.getComponent(Velocity)?.vy ?? 0),
                0
            );
        }
    }
}
