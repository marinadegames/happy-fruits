import { Component } from '../Component';

export class Health extends Component {
    constructor(public value: number = 3) {
        super();
    }

    loseLife() {
        this.value -= 1;
    }

    isDead() {
        return this.value <= 0;
    }
}
