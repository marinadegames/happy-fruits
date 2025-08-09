import { instantiate, Label, Node, Prefab, tween, UITransform, Vec3 } from 'cc';
import { View } from 'db://assets/scripts/ecs/components/View';
import { Entity } from 'db://assets/scripts/ecs/Entity';
import { System } from 'db://assets/scripts/ecs/System';

export class ParticleSystem extends System {
    public explodeParticlePrefab: Prefab | null = null;
    public fireLabelParticle: Prefab | null = null;
    private fireParticlesInstance: Node = null;

    update(): void {}

    explode(item: Entity): void {
        const view = item.getComponent(View);
        if (view && this.explodeParticlePrefab) {
            const explode = instantiate(this.explodeParticlePrefab);
            explode.setPosition(view.node.getPosition());
            view.node.parent?.addChild(explode);
            this.destroy(explode);
        }
    }

    fireAtLabel(label: Label): void {
        if (!this.fireLabelParticle) return;
        if (this.fireParticlesInstance != null) return;

        this.fireParticlesInstance = instantiate(this.fireLabelParticle);

        const labelNode = label.node;
        const uiTransform = labelNode.getComponent(UITransform);

        if (!uiTransform) return;

        const size = uiTransform.contentSize;
        const originalPos = labelNode.getPosition();
        const centeredPos = originalPos.add(new Vec3(size.width / 2, 0, 0));

        this.fireParticlesInstance?.setPosition(centeredPos);

        labelNode.parent?.insertChild(this.fireParticlesInstance, 0);
    }

    stopFireAtLabel(): void {
        this.fireParticlesInstance?.destroy();
        this.fireParticlesInstance = null;
    }

    private destroy(node: Node) {
        tween(node)
            .delay(1.0)
            .call(() => node.destroy())
            .start();
    }
}
