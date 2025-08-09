import { Node } from 'cc';
import { Component } from 'db://assets/scripts/ecs/Component';

export class View extends Component {
    constructor(public node: Node) {
        super();
    }
}
