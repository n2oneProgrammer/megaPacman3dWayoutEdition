import Vector3 from "../math/Vector3.js";
import Module from "./Module.js";

export interface IModel {
    position: Vector3;
}

export default class Model {
    private readonly _modules: Module[];

    constructor() {
        this._modules = [];
    }

    addModule(module: Module) {
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
}