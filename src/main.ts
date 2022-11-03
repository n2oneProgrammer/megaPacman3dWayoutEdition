import './style.css'
import CanvasController from "./logic/CanvasController.js";
import Model from "./logic/Model";
import RenderModule from "./logic/modules/RenderModule";
import CameraModule from "./logic/modules/CameraModule";
import OneColorTexture from "./logic/Textures/OneColorTexture";
import Color from "./math/Color";
import Module from "./logic/Module";
// import FlyingCamera from "./gameLogic/FlyingCamera";
import Vector3 from "./math/Vector3";
import {deg2rad} from "./math/Utils";
import {cubeMesh, ghostMesh} from "./logic/BasicFigures";
import GeneratedScene from "./gameLogic/GeneratedScene";

class myComponent extends Module {
    private speed: number;

    constructor(speed: number) {
        super();
        this.speed = speed;
    }

    update(deltaTime: number): void {
        if (!this.modelOwner) return;
        this.modelOwner.rotation = this.modelOwner.rotation.add(new Vector3([0, this.speed * deltaTime, 0]))
    }

}

let canvas = new CanvasController("#mainCanvas");
let scene = new GeneratedScene({
    canvasController: canvas,
    mapMask: [
        [0,4,2,8,4,4,4,4,2,8,4,0],
        [2,9,4,0,5,1,1,5,0,4,3,8],
        [0,0,5,2,13,4,4,7,8,5,0,0],
        [2,12,1,0,5,5,5,5,0,1,6,8],
        [0,1,2,8,1,1,1,1,2,8,1,0]

    ],
    tileSize: 10
});
let cam = new Model({
    position: new Vector3([0, 130, 0]),
    rotation: new Vector3([deg2rad(-90),0, deg2rad(90)])
});
let cameraModule = new CameraModule({
    fov: 60,
    near: 0.01,
    far: 1000
});
// let flyCam = new FlyingCamera({
//     movementSpeed: 30,
//     sensitivity: 2
// });
cam.addModule(cameraModule);
// cam.addModule(flyCam);
scene.addModel(cam);
cameraModule.setAsMainCamera();
let model = new Model({
    rotation: new Vector3([0, 0, 0]),
    position: new Vector3([0, 0, 0]),
    scale: new Vector3([1, 1, 1])
});
let renderModule = new RenderModule({
    mesh: ghostMesh,
    texture: new OneColorTexture(new Color([256, 0, 0, 1]))
});
model.addModule(renderModule);
// model.addModule(flyCam);
model.addModule(new myComponent(30));
scene.addModel(model);

let model2 = new Model({
    rotation: new Vector3([0, 0, 0]),
    position: new Vector3([0, -2, 0]),
    scale: new Vector3([2, 0.2, 2])
});
let renderModule2 = new RenderModule({
    mesh: cubeMesh,
    texture: new OneColorTexture(new Color([256, 0, 0, 1]))
});
model2.addModule(renderModule2);
// model2.addModule(new myComponent(30));
scene.addModel(model2);

scene.start();
