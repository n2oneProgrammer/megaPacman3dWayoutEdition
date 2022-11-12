export interface IVector2 {
    x: number;
    y: number;
}

export default class Vector2 {
    private _x: number;
    private _y: number;

    constructor(data: IVector2 | [number, number]) {
        if (data instanceof Array) {
            this._x = data[0];
            this._y = data[1];
        } else {
            this._x = data.x;
            this._y = data.y;
        }
    }

    toArray(): [number, number] {
        return [this._x, this._y];
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    sub(v: Vector2) {
        return new Vector2([this._x - v._x, this._y - v._y])
    }

    add(v: Vector2) {
        return new Vector2([this._x + v._x, this._y + v._y])
    }

    mul(v: Vector2 | number) {
        if (v instanceof Vector2)
            return new Vector2([this._x * v._x, this._y * v._y]);
        return new Vector2([this._x * v, this._y * v]);
    }

    dot(v: Vector2) {
        return this._x * v._x + this._y * v._y;
    }

    lengthSq(): number {
        return this._x * this._x + this._y * this._y;
    }

    public static one = new Vector2([1, 1]);
    public static zero = new Vector2([0, 0]);

    normalize() {
        return this.mul(1 / Math.sqrt(this.lengthSq()));
    }
}
