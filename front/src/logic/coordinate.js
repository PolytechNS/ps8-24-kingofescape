export default class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toNumber() {
        return this.x * 10 + this.y;
    }

    static toNumberXY(x, y) {
        return x * 10 + y;
    }
}