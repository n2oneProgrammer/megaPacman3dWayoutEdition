import './style.css'
import CanvasController from "./logic/CanvasController.js";
import Model from "./logic/Model";
import RenderModule from "./logic/modules/RenderModule";
import CameraModule from "./logic/modules/CameraModule";
import OneColorTexture from "./logic/Textures/OneColorTexture";
import Color from "./math/Color";
import Module from "./logic/Module";
import Vector3 from "./math/Vector3";
import {cubeMesh, ghostMesh} from "./logic/BasicFigures";
import FlyingCamera from "./gameLogic/FlyingCamera";
import CircleXZCollider from "./logic/modules/Colliders/CircleXZCollider";
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
        [0, 4, 2, 8, 4, 4, 4, 4, 2, 8, 4, 0],
        [2, 9, 4, 0, 5, 1, 1, 5, 0, 4, 3, 8],
        [0, 0, 5, 2, 13, 4, 4, 7, 8, 5, 0, 0],
        [2, 12, 1, 0, 5, 5, 5, 5, 0, 1, 6, 8],
        [0, 1, 2, 8, 1, 1, 1, 1, 2, 8, 1, 0]

    ],
    tileSize: 3,
    wallHeight: 2,
    wallColor: Color.randomColor(),
    floorColor: Color.randomColor()
});
// let scene = new Scene(canvas);
let cam = new Model({
    position: new Vector3([1, 2, 0]),
    rotation: new Vector3([0, 0, 0])
});
let cameraModule = new CameraModule({
    fov: 60,
    near: 0.01,
    far: 1000
});
let flyCam = new FlyingCamera({
    movementSpeed: 10,
    sensitivity: 5
});
let collider = new CircleXZCollider({radius: 1});
cam.addModule(cameraModule);
cam.addModule(flyCam);
cam.addModule(collider);
scene.addModel(cam);
cameraModule.setAsMainCamera();
let model = new Model({
    rotation: new Vector3([0, 0, 0]),
    position: new Vector3([0, 2, 0]),
    scale: new Vector3([1, 1, 1])
});
let renderModule = new RenderModule({
    mesh: ghostMesh,
    texture: new OneColorTexture(new Color([256, 0, 0, 1]))
});
// let collider2 = new CircleXZCollider({radius: 1});
model.addModule(renderModule);
// model.addModule(collider2);
model.addModule(new myComponent(30));
scene.addModel(model);

let model2 = new Model({
    rotation: new Vector3([0, 0, 0]),
    position: new Vector3([0, 1, 0]),
    scale: new Vector3([1, 1, 1])
});
let renderModule2 = new RenderModule({
    mesh: cubeMesh,
    texture: new OneColorTexture(new Color([256, 0, 0, 1]))
});
model2.addModule(renderModule2);
// model2.addModule(flyCam);
// model2.addModule(new RectXZCollider({size: Vector2.one}));
scene.addModel(model2);

scene.start();
