import { Component } from 'db://assets/scripts/ecs/Component';

export class Score extends Component {
    private BONUS_NUM: number = 5;

    constructor(public value: number = 0) {
        super();
    }

    increment(): void {
        this.value++;
    }

    bonusIncrement(): void {
        this.value += this.BONUS_NUM;
    }
}
