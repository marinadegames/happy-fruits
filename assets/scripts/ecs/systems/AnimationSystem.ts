import { Color, Label, Node, Sprite, tween, Vec3 } from 'cc';
import { Entity } from 'db://assets/scripts/ecs/Entity';
import { System } from 'db://assets/scripts/ecs/System';

import { View } from '../components/View';

const SCALE_HIT_1 = new Vec3(1.1, 0.9, 1);
const SCALE_HIT_2 = new Vec3(0.9, 1.1, 1);
const SCALE_HIT_3 = new Vec3(1.05, 0.95, 1);
const SCALE_NORMAL = Vec3.ONE;
const SCALE_LABEL_POP = new Vec3(1.11, 1.11, 1.11);
const DAMAGE_COLOR = new Color(255, 50, 50);

export class AnimationSystem extends System {
    update(): void {}

    hitAnimation(entity: Entity) {
        const view = entity.getComponent(View);
        if (!view) return;

        tween(view.node)
            .to(0.05, { scale: SCALE_HIT_1 })
            .to(0.05, { scale: SCALE_HIT_2 })
            .to(0.05, { scale: SCALE_HIT_3 })
            .to(0.05, { scale: SCALE_NORMAL })
            .start();
    }

    labelAnimation(label: Label) {
        const node = label.node;
        node.setScale(SCALE_NORMAL);

        tween(node).to(0.1, { scale: SCALE_LABEL_POP }).to(0.1, { scale: SCALE_NORMAL }).start();
    }

    damageFlash(entity: Entity) {
        const view = entity.getComponent(View);
        if (!view) return;

        const node = view.node;
        const sprite = node.getComponent(Sprite);
        if (!sprite) return;

        const originalColor = sprite.color.clone();

        tween()
            .call(() => {
                sprite.color = DAMAGE_COLOR;
            })
            .target(node)
            .to(0.1, { scale: SCALE_HIT_1 })
            .to(0.1, { scale: SCALE_HIT_2 })
            .to(0.1, { scale: SCALE_HIT_3 })
            .call(() => {
                sprite.color = DAMAGE_COLOR;
            })
            .to(0.1, { scale: SCALE_NORMAL })
            .call(() => {
                sprite.color = originalColor;
            })
            .start();
    }

    showFloatingScore(floatingLabelNode: Node, text: string) {
        const label = floatingLabelNode.getComponent(Label);
        if (label) label.string = text;

        tween(floatingLabelNode)
            .by(0.8, { position: new Vec3(0, 50, 0) }, { easing: 'quadOut' })
            .call(() => floatingLabelNode.destroy())
            .start();
    }
}
