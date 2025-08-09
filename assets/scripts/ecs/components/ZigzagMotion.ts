import { Vec3 } from 'cc';

export class ZigzagMotion {
    amplitude: number;
    frequency: number;
    time: number;
    basePosition: Vec3;

    constructor(
        amplitude: number = 50,
        frequency: number = 1,
        baseX: number = 0,
        baseY: number = 0
    ) {
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.time = 0;
        this.basePosition = new Vec3(baseX, baseY, 0);
    }
}
