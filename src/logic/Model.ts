import Module from "./Module.js";
import Vector3 from "../math/Vector3";
import Quaternion from "../math/Quaternion";

export interface IModel {
    position?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
}

export default class Model {
    private _position: Vector3;
    private _rotation: Vector3;
    private _scale: Vector3;
    private readonly _modules: Module[];

    constructor({position, rotation, scale}: IModel) {
        this._modules = [];
        this._position = position || Vector3.zero;
        this._rotation = rotation || Vector3.zero;
        this._scale = scale || Vector3.one;
    }

    addModule(module: Module) {
        module.modelOwner = this;
        this._modules.push(module);
        this._modules.sort((a, b) => a.important - b.important);
    }

    update(deltaTime: number) {
        this._modules.forEach(m => m.update(deltaTime));
    }

    get modules(): Module[] {
        return this._modules;
    }

    get position(): Vector3 {
        return this._position;
    }

    set position(value: Vector3) {
        this._position = value;
    }

    get rotation(): Vector3 {
        return this._rotation;
    }

    set rotation(value: Vector3) {
        this._rotation = value;
    }

    get scale(): Vector3 {
        return this._scale;
    }

    set scale(value: Vector3) {
        this._scale = value;
    }

    getQuaternionRotation(): Quaternion {
        return Quaternion.setFromEuler(this._rotation);
    }
}
