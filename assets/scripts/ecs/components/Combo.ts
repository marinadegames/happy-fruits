export class Combo {
    private MIN_COUNT_COMBO: number = 3;
    count: number = 0;

    reset() {
        this.count = 0;
    }

    increment() {
        this.count++;
    }

    isCombo(): boolean {
        return this.count >= this.MIN_COUNT_COMBO;
    }
}
