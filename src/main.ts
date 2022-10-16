import './style.css'
import CanvasController from "./logic/CanvasController.js";
import Scene from "./logic/Scene";
import Model from "./logic/Model";
import RenderModule from "./logic/modules/RenderModule";
import CameraModule from "./logic/modules/CameraModule";
import OneColorTexture from "./logic/Textures/OneColorTexture";
import Color from "./math/Color";
import OBJLoader from "./logic/Loaders/OBJLoader";
import FileLoader from "./logic/Loaders/FileLoader";
import Module from "./logic/Module";
import {vec3} from "gl-matrix";

class myComponent extends Module {
    private speed: number;

    constructor(speed: number) {
        super();
        this.speed = speed;
    }

    update(deltaTime: number): void {
        if (!this.modelOwner) return;
        vec3.add(this.modelOwner.rotation, this.modelOwner.rotation, [0, this.speed * deltaTime, 0])
    }

}

let cubeMesh = OBJLoader.parse(await FileLoader.load("resources/models/cube.obj"));
console.log(cubeMesh);
let canvas = new CanvasController("#mainCanvas");
let scene = new Scene(canvas);
let cam = new Model({
    position: [0, 0, -10],
    rotation: [0, 30, 0]
});
let cameraModule = new CameraModule({
    fov: 60,
    near: 0.01,
    far: 1000
});
cam.addModule(cameraModule);
scene.addModel(cam);
cameraModule.setAsMainCamera();
let model = new Model({
    rotation: [0, 0, 0],
    position: [0, 0, -5],
    scale: [1, 1, 1]
});
let renderModule = new RenderModule({
    mesh: cubeMesh,
    texture: new OneColorTexture(new Color([1, 0, 0, 1]))
});
model.addModule(renderModule);
model.addModule(new myComponent(30));
scene.addModel(model);
scene.start();
