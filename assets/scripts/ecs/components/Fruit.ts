import { Component } from '../Component';

export class Fruit extends Component {
    constructor(
        public type: string,
        public isDangerous = false
    ) {
        super();
    }
}
