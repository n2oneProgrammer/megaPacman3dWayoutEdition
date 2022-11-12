import Module from "../logic/Module";
import CanvasController from "../logic/CanvasController";
import InputService from "../logic/services/InputService";
import {vec3} from "gl-matrix";
import Vector3 from "../math/Vector3";
import Quaternion from "../math/Quaternion";
import {deg2rad} from "../math/Utils";
import Colliders from "../logic/modules/Colliders";

export interface IFlyingCamera {
    movementSpeed: number;
    sensitivity: number
}

export default class FlyingCamera extends Module {
    private movementSpeed: number;
    private sensitivity: number;
    private prevPos: Vector3;

    constructor({movementSpeed, sensitivity}: IFlyingCamera) {
        super();
        this.prevPos = Vector3.zero;
        this.movementSpeed = movementSpeed;
        this.sensitivity = sensitivity;
        CanvasController.instance?.canvasDOM.addEventListener("click", () => InputService.instance.mouseLock());
    }

    update(deltaTime: number): void {
        if (this.modelOwner == null) return;
        let block = [0, 0, 0];
        let colliders = this.modelOwner.modules.filter(m => m instanceof Colliders && m.isCollide);
        if (colliders.length > 0) {




            this.modelOwner.position = this.prevPos;
        }
        this.prevPos = this.modelOwner.position;
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
