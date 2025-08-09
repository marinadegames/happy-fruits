import { Component } from './Component';

type ComponentConstructor<T extends Component = Component> = new (...args: never[]) => T;

export class Entity {
    private static nextId = 0;
    readonly id: number;
    private components = new Map<ComponentConstructor, Component>();

    constructor() {
        this.id = Entity.nextId++;
    }

    addComponent<T extends Component>(component: T): this {
        this.components.set(component.constructor as ComponentConstructor<T>, component);
        return this;
    }

    getComponent<T extends Component>(type: ComponentConstructor<T>): T | undefined {
        return this.components.get(type) as T | undefined;
    }

    hasComponent<T extends Component>(type: ComponentConstructor<T>): boolean {
        return this.components.has(type);
    }

    removeComponent<T extends Component>(type: ComponentConstructor<T>): void {
        this.components.delete(type);
    }
}
