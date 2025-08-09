import { Component } from '../Component';

export class Timer extends Component {
    constructor(
        public duration: number,
        public elapsed: number = 0
    ) {
        super();
    }

    get remaining(): number {
        return Math.max(0, this.duration - this.elapsed);
    }

    get isFinished(): boolean {
        return this.remaining <= 0;
    }
}
