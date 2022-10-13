import './style.css'
import CanvasController from "./logic/CanvasController.js";
import Scene from "./logic/Scene";
import Model from "./logic/Model";
import RenderModule from "./logic/modules/RenderModule";
import CameraModule from "./logic/modules/CameraModule";

let canvas = new CanvasController("#mainCanvas");
let scene = new Scene(canvas);
let cam = new Model({
    position: [-20, 0, 0],
    rotation: [0, 90, 0]
});
let cameraModule = new CameraModule({
    fov: 60,
    near: 1,
    far: 1000
});
cam.addModule(cameraModule);
scene.addModel(cam);
cameraModule.setAsMainCamera();
let model = new Model({
    rotation: [0, 30, 80],
    position: [0, 2, 0],
    scale: [2, 2, 2]
});
let renderModule = new RenderModule();
model.addModule(renderModule);
scene.addModel(model);
scene.start();
