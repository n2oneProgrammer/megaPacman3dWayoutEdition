import Module from "../logic/Module";
import CanvasController from "../logic/CanvasController";
import InputService from "../logic/services/InputService";
import {vec3} from "gl-matrix";
import Vector3 from "../math/Vector3";
import Quaternion from "../math/Quaternion";
import Colliders from "../logic/modules/Colliders";
import RectXZCollider from "../logic/modules/Colliders/RectXZCollider";
import CircleXZCollider from "../logic/modules/Colliders/CircleXZCollider";
import Vector2 from "../math/Vector2";

export interface IFlyingCamera {
    movementSpeed: number;
    sensitivity: number
}

export default class FlyingCamera extends Module {
    private movementSpeed: number;
    private sensitivity: number;


    constructor({movementSpeed, sensitivity}: IFlyingCamera) {
        super(102);
        this.movementSpeed = movementSpeed;
        this.sensitivity = sensitivity;
        CanvasController.instance?.canvasDOM.addEventListener("click", () => InputService.instance.mouseLock());
    }

    repairPosition() {
        if (this.modelOwner == null) return;
        let colliders = this.modelOwner.modules.filter(m => m instanceof Colliders && m.isCollide);
        if (colliders.length > 0) {
            let finalTransform = new Vector2([0, 0]);
            colliders.forEach(c => {
                if (c instanceof CircleXZCollider) {
                    c.collisionsObjects.forEach((r) => {
                        if (r == c) return;
                        if (!(r instanceof RectXZCollider)) return;
                        let t = r as RectXZCollider;
                        let tObject = t.modelOwner;
                        if (this.modelOwner == null || tObject == null) return;

                        let min = tObject.position.toVec2XZ().sub(t.size);
                        let max = tObject.position.toVec2XZ().add(t.size);
                        let closestPointTab: [number, number] = [this.modelOwner.position.x, this.modelOwner.position.z];
                        closestPointTab[0] = closestPointTab[0] < min.x ? min.x : closestPointTab[0];
                        closestPointTab[1] = closestPointTab[1] < min.y ? min.y : closestPointTab[1];
                        closestPointTab[0] = closestPointTab[0] > max.x ? max.x : closestPointTab[0];
                        closestPointTab[1] = closestPointTab[1] > max.y ? max.y : closestPointTab[1];

                        let closestPoint = new Vector2(closestPointTab);

                        let distanceSq = closestPoint.sub(this.modelOwner.position.toVec2XZ()).lengthSq();
                        let normal;
                        if (distanceSq == 0) {
                            normal = closestPoint.sub(tObject.position.toVec2XZ()).normalize();
                        } else {
                            normal = this.modelOwner.position.toVec2XZ().sub(closestPoint).normalize();
                        }
                        
                        let trans: [number, number] = [0, 0];
                        if (normal.x != 0) {
                            trans[0] = ((c.radius + t.size.x) - Math.abs(this.modelOwner.position.x - tObject.position.x)) * normal.x;
                        } else if (normal.y != 0) {
                            trans[1] = ((c.radius + t.size.y) - Math.abs(this.modelOwner.position.z - tObject.position.z)) * normal.y;
                        }
                        finalTransform = finalTransform.add(new Vector2(trans));
                    });
                    if (this.modelOwner) {
                        this.modelOwner.position = this.modelOwner.position.add(new Vector3([finalTransform.x, 0, finalTransform.y]));
                    }
                }
            });
        }
    }

    update(deltaTime: number): void {
        if (this.modelOwner == null) return;
        let move: vec3 = [0, 0, 0];
        if (InputService.instance.isKeyButtonPress("w")) {
            move[2] = -1;
        }
        if (InputService.instance.isKeyButtonPress("s")) {
            move[2] = 1;
        }
        if (InputService.instance.isKeyButtonPress("d")) {
            move[0] = 1;
        }
        if (InputService.instance.isKeyButtonPress("a")) {
            move[0] = -1;
        }
        let trans = Quaternion.setFromEuler(this.modelOwner.rotation).mul(new Vector3(move)) as Vector3;
        this.modelOwner.position = this.modelOwner.position.add(trans.mul(this.movementSpeed * deltaTime));

        let mouseMove = InputService.instance.getMouseMoment();
        this.modelOwner.rotation = this.modelOwner.rotation.add(new Vector3([0, -mouseMove.x, 0]).mul(this.sensitivity * deltaTime));
    }

    clip(v: number, min: number, max: number) {
        if (v < min) {
            return min;
        }
        if (v > max) {
            return max;
        }
        return v;
    }

}
