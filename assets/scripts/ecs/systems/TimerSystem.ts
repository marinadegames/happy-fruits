import { Timer } from 'db://assets/scripts/ecs/components/Timer';
import { System } from 'db://assets/scripts/ecs/System';
import { World } from 'db://assets/scripts/ecs/World';

export class TimerSystem extends System {
    update(world: World, dt: number): void {
        for (const entity of world.entities) {
            const timer = entity.getComponent(Timer);
            if (!timer) {
                continue;
            }
            timer.elapsed += dt;
        }
    }
}
