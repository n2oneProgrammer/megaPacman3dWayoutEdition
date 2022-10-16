import Module from "./Module.js";
import {quat, vec3} from "gl-matrix"

export interface IModel {
    position?: vec3;
    rotation?: vec3;
    scale?: vec3;
}

export default class Model {
    position: vec3;
    rotation: vec3;
    scale: vec3;
    private readonly _modules: Module[];

    constructor({position, rotation, scale}: IModel) {
        this._modules = [];
        this.position = position || [0, 0, 0];
        this.rotation = rotation || [0, 0, 0];
        this.scale = scale || [1, 1, 1];
        console.log(this);
    }

    addModule(module: Module) {
        module.modelOwner = this;
        this._modules.push(module);
        this._modules.sort((a, b) => a.important - b.important);
        console.log(this._modules);
    }

    update(deltaTime: number) {
        this._modules.forEach(m => m.update(deltaTime))
    }

    get modules(): Module[] {
        return this._modules;
    }

    getQuaternionRotation(): quat {
        const rotQuaternion = quat.create();
        quat.fromEuler(rotQuaternion, this.rotation[0], this.rotation[1] + 180, this.rotation[2])
        return rotQuaternion
    }
}
