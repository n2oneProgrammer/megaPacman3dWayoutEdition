import Colliders from "../Colliders";
import RectXZCollider from "./RectXZCollider";

export interface ICircleXZCollider {
    radius: number;
    whenCollide?: () => void;
}

export default class CircleXZCollider extends Colliders {
    private _radius: number;

    constructor({radius, whenCollide}: ICircleXZCollider) {
        super('circleXZ', whenCollide || (() => {
        }));
        this._radius = radius;
    }

    protected checkCollision(collider: Colliders): void {
        switch (collider.colliderName) {
            case 'circleXZ':
                console.error("NOT IMPLEMENTED");
                break;
            case 'rectXZ':
                if ((collider as RectXZCollider).checkCollisionCircleXZ(this)) {
                    this._isCollide = true;
                    this.collisionsObjects.push(collider);
                    this.whenCollide();
                }
        }

    }

    get radius(): number {
        return this._radius;
    }
}
