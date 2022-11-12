import Module from "./Module.js";
import Vector3 from "../math/Vector3";
import Quaternion from "../math/Quaternion";

export interface IModel {
    position?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
}

export default class Model {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    private readonly _modules: Module[];

    constructor({position, rotation, scale}: IModel) {
        this._modules = [];
        this.position = position || Vector3.zero;
        this.rotation = rotation || Vector3.zero;
        this.scale = scale || Vector3.one;
        console.log(this);
    }

    addModule(module: Module) {
        module.modelOwner = this;
        this._modules.push(module);
        this._modules.sort((a, b) => a.important - b.important);
        console.log(this._modules);
    }

    update(deltaTime: number) {
        this._modules.forEach(m => m.update(deltaTime));
    }

    get modules(): Module[] {
        return this._modules;
    }

    getQuaternionRotation(): Quaternion {
        return Quaternion.setFromEuler(this.rotation);
    }
}
