import Colliders from "../Colliders";
import Vector2 from "../../../math/Vector2";
import CircleXZCollider from "./CircleXZCollider";

export interface IRectXZCollider {
    size: Vector2;
}

export default class RectXZCollider extends Colliders {
    private _size: Vector2;

    constructor({size}: IRectXZCollider) {
        super('rectXZ');
        this._size = size;
    }

    protected checkCollision(collider: Colliders): void {

        switch (collider.colliderName) {
            case 'circleXZ':
                if (this.checkCollisionCircleXZ(collider as CircleXZCollider)) {
                    this._isCollide = true;
                    this.collisionsObjects.push(collider);
                }
                break;

        }

    }

    public checkCollisionCircleXZ(collider: CircleXZCollider): boolean {
        let myOwner = this.modelOwner;
        let yourOwner = collider.modelOwner;
        if (myOwner == null || yourOwner == null) return false;
        let min = new Vector2([myOwner.position.x, myOwner.position.z]).sub(this.size);
        let max = new Vector2([myOwner.position.x, myOwner.position.z]).add(this.size);
        let closestPoint = {
            x: yourOwner.position.x,
            y: yourOwner.position.z
        }
        if (closestPoint.x < min.x) {
            closestPoint.x = min.x;
        } else if (closestPoint.x > max.x) {
            closestPoint.x = max.x;
        }
        if (closestPoint.y < min.y) {
            closestPoint.y = min.y;
        } else if (closestPoint.y > max.y) {
            closestPoint.y = max.y;
        }
        return new Vector2(closestPoint).sub(new Vector2([yourOwner.position.x, yourOwner.position.z])).lengthSq() <= collider.radius * collider.radius
    }

    get size(): Vector2 {
        let scale = new Vector2([
            this.modelOwner?.scale.x || 1,
            this.modelOwner?.scale.z || 1,
        ])
        return this._size.mul(scale);
    }
}
