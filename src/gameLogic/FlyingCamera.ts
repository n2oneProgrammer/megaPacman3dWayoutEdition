import Module from "../logic/Module";
import CanvasController from "../logic/CanvasController";
import InputService from "../logic/services/InputService";
import {vec3} from "gl-matrix";
import Vector3 from "../math/Vector3";
import Quaternion from "../math/Quaternion";
import {deg2rad} from "../math/Utils";
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

    // private prevPos: Vector3;

    constructor({movementSpeed, sensitivity}: IFlyingCamera) {
        super(102);
        // this.prevPos = Vector3.zero;
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
                        let transform = this.modelOwner.position.toVec2XZ().sub(tObject.position.toVec2XZ());
                        transform = transform.mul(normal);
                        transform = transform.sub(new Vector2([t.size.x + c.radius + 0.001, t.size.y + c.radius + 0.001]))
                        transform = transform.mul(normal);
                        console.log("");
                        console.log("NORMAL", normal);
                        console.log("POSITION", this.modelOwner.position, tObject.position);
                        console.log("RADIUS AND SIZE", c.radius, t.size);
                        console.log("DIFF IN POS", this.modelOwner.position.sub(tObject.position));
                        console.log("TRANSFORM", transform);
                        if (transform.y != 0) {
                            console.error(c, t);
                        }
                        finalTransform = finalTransform.add(transform);
                        // this.modelOwner.position = this.modelOwner.position.sub(new Vector3([transform.x, 0, transform.y]));
                    });
                    if (this.modelOwner)
                        this.modelOwner.position = this.modelOwner.position.sub(new Vector3([finalTransform.x, 0, finalTransform.y]));
                }
            })
            // this.modelOwner.position = this.prevPos;
        }
    }

    update(deltaTime: number): void {
        if (this.modelOwner == null) return;
        let block = [0, 0, 0];
        // this.prevPos = this.modelOwner.position;
        let move: vec3 = [0, 0, 0];
        // console.log(InputService.instance.getKeyPress());
        if (InputService.instance.isKeyButtonPress("w") && block[0] != -1) {
            move[2] = -1;
        }
        if (InputService.instance.isKeyButtonPress("s") && block[0] != 1) {
            move[2] = 1;
        }
        if (InputService.instance.isKeyButtonPress("d") && block[2] != 1) {
            move[0] = 1;
        }
        if (InputService.instance.isKeyButtonPress("a") && block[2] != -1) {
            move[0] = -1;
        }
        let trans = Quaternion.setFromEuler(this.modelOwner.rotation).mul(new Vector3(move)) as Vector3;
        this.modelOwner.position = this.modelOwner.position.add(trans.mul(this.movementSpeed * deltaTime));

        let mouseMove = InputService.instance.getMouseMoment();
        this.modelOwner.rotation = this.modelOwner.rotation.add(new Vector3([0, -mouseMove.x, 0]).mul(this.sensitivity * deltaTime));
        this.modelOwner.rotation = new Vector3([this.clip(this.modelOwner.rotation.x, 0, deg2rad(70)), this.modelOwner.rotation.y, this.modelOwner.rotation.z,])
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
