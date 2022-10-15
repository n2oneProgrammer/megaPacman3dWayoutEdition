export default abstract class Texture {
    protected _colorVertices: number[];

    protected constructor() {
        this._colorVertices = [];
    }

    public abstract calculatingColor(vertices: number[]): void;

    get colorVertices(): number[] {
        return this._colorVertices;
    }
}
