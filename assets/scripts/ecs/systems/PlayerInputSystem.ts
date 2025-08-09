import { EventMouse, EventTouch, Input, input, Vec3 } from 'cc';
import { System } from 'db://assets/scripts/ecs/System';

import { PlayerControlled } from '../components/PlayerControlled';
import { View } from '../components/View';
import { World } from '../World';

export class PlayerInputSystem extends System {
    private pointerX: number | null = null;

    constructor() {
        super();
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private onMouseMove(event: EventMouse) {
        this.pointerX = event.getUILocation().x;
    }

    private onTouchStart(event: EventTouch) {
        const touches = event.getTouches();
        if (touches.length > 0) {
            this.pointerX = touches[0].getUILocation().x;
        }
    }

    private onTouchMove(event: EventTouch) {
        const touches = event.getTouches();
        if (touches.length > 0) {
            this.pointerX = touches[0].getUILocation().x;
        }
    }

    private onTouchEnd() {
        this.pointerX = null;
    }

    update(world: World): void {
        if (this.pointerX === null) {
            return;
        }

        for (const entity of world.entities) {
            if (entity.hasComponent(View) && entity.hasComponent(PlayerControlled)) {
                const view = entity.getComponent(View)!;
                const pos = view.node.getPosition();

                let xPos = this.pointerX - 640;

                const halfWidth = 640;
                if (xPos < -halfWidth) xPos = -halfWidth;
                if (xPos > halfWidth) xPos = halfWidth;

                view.node.setPosition(new Vec3(xPos, pos.y, pos.z));
            }
        }
    }
}
