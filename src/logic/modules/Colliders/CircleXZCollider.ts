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
                if (this.checkCollisionCircleXZ(collider as CircleXZCollider)) {
                    this._isCollide = true;
                    this.collisionsObjects.push(collider);
                    this.whenCollide();
                }
                break;
            case 'rectXZ':
                if ((collider as RectXZCollider).checkCollisionCircleXZ(this)) {
                    this._isCollide = true;
                    this.collisionsObjects.push(collider);
                    this.whenCollide();
                }
        }

    }

    checkCollisionCircleXZ(collider: CircleXZCollider) {
        let myOwner = this.modelOwner;
        let yourOwner = collider.modelOwner;
        if (myOwner == null || yourOwner == null) return false;
        let disVec = yourOwner.position.toVec2XZ().sub(myOwner.position.toVec2XZ());
        let distanceSqt = disVec.lengthSq();
        let sumRadius = this.radius + collider.radius;
        return distanceSqt < sumRadius * sumRadius;
    }

    get radius(): number {
        return this._radius;
    }
}
