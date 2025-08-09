import { Node, UITransform } from 'cc';

import { Component } from '../Component';

export class Collider extends Component {
    constructor(
        public width: number,
        public height: number
    ) {
        super();
    }

    static fromNode(node: Node): Collider {
        const size = node.getComponent(UITransform).contentSize;
        return new Collider(size.width, size.height);
    }
}
