import Model from "./Model";

export default abstract class Module {
    private readonly _important: number;
    modelOwner: Model | null = null;

    protected constructor(important: number = 0) {
        this._important = important;
    }

    abstract update(deltaTime: number): void;

    get important(): number {
        return this._important;
    }
}
