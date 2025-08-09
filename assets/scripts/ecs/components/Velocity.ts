import { Component } from '../Component';

export class Velocity extends Component {
    constructor(
        public vx: number = 0,
        public vy: number = 0
    ) {
        super();
    }
}
