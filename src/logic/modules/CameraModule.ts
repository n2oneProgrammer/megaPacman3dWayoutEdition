import Module from "../Module";
import CanvasController from "../CanvasController";
import {mat4} from "gl-matrix";
import Scene from "../Scene";
import Quaternion from "../../math/Quaternion";

export interface ICameraModule {
    fov: number;
    aspect?: number;
    near: number;
    far: number
}

export default class CameraModule extends Module {
    private fov: number;
    private aspect: number;
    private near: number;
    private far: number;
    private _perspective: mat4;

    constructor({fov, aspect, near, far}: ICameraModule) {
        super(10);

        this.fov = fov;
        this.aspect = aspect || CanvasController.instance?.getAspect() || window.innerWidth / window.innerHeight;
        this.near = near;
        this.far = far;
        this._perspective = mat4.create();
        this.calcPerspective();
    }

    public setAsMainCamera() {
        Scene.instance.mainCamera = this;
    }

    public getViewMatrix() {
        let owner = this.modelOwner;
        let result = mat4.create();
        if (!owner) return result;
        mat4.fromRotationTranslation(result, Quaternion.setFromEuler(owner.rotation).toArray(), owner.position.toArray());
        return result;
    }

    private calcPerspective() {
        this._perspective = mat4.create();
        mat4.perspective(this._perspective, this.fov * Math.PI / 180, this.aspect, this.near, this.far);
    }

    update(_: number): void {
    }

    get perspective(): mat4 {
        return this._perspective;
    }
}
