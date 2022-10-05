interface IColor {
    r: number;
    g: number;
    b: number;
    a: number
}

export default class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    constructor(data: IColor | [number, number, number, number]) {
        if (data instanceof Array) {
            this._r = data[0];
            this._g = data[1];
            this._b = data[2];
            this._a = data[3];
        } else {
            this._r = data.r;
            this._g = data.g;
            this._b = data.b;
            this._a = data.a;
        }
    }

    toString(): string {
        return `rgba(${this._r},${this._g},${this._b},${this._a})`;
    }

    //getters and setters

    get r(): number {
        return this._r;
    }

    set r(value: number) {
        this._r = value;
    }

    get g(): number {
        return this._g;
    }

    set g(value: number) {
        this._g = value;
    }

    get b(): number {
        return this._b;
    }

    set b(value: number) {
        this._b = value;
    }

    get a(): number {
        return this._a;
    }

    set a(value: number) {
        this._a = value;
    }

//static
    static BLACK = new Color([0, 0, 0, 1]);
    static WHITE = new Color([255, 255, 255, 1]);

    static randomColor(): Color {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        return new Color([r, g, b, 1])
    }
}