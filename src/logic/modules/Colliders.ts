import Module from "../Module";

export default abstract class Colliders extends Module {
    static colliders: Colliders[] = [];
    protected _isCollide: boolean = false;
    private _collisionsObjects: Colliders[] = [];
    private readonly _colliderName: string;
    protected whenCollide: () => void;

    protected constructor(name: string, whenCollide: () => void) {
        super(101);
        Colliders.colliders.push(this);
        this._colliderName = name;
        this.whenCollide = whenCollide;
        this._isCollide = false;
    }

    update(_: number): void {
        this._isCollide = false;
        this._collisionsObjects = [];
        Colliders.colliders.forEach((c) => {
            if (c != this) {
                this.checkCollision(c);
            }
        });
    }

    protected abstract checkCollision(collider: Colliders): void;

    get isCollide(): boolean {
        return this._isCollide;
    }

    get colliderName(): string {
        return this._colliderName;
    }

    public get collisionsObjects(): Colliders[] {
        return this._collisionsObjects;
    }
}
