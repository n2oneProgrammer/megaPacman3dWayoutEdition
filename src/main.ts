import CanvasController from "./logic/CanvasController.js";
import Model from "./logic/Model";
import CameraModule from "./logic/modules/CameraModule";
import Color from "./math/Color";
import Vector3 from "./math/Vector3";
import FlyingCamera from "./gameLogic/FlyingCamera";
import CircleXZCollider from "./logic/modules/Colliders/CircleXZCollider";
import GeneratedScene from "./gameLogic/GeneratedScene";
import MapController from "./logic/MapController";
import Vector2 from "./math/Vector2";
import DrawImageOnMap from "./gameLogic/map/DrawImageOnMap";
import PointManager from "./gameLogic/PointManager";
import InfoCanvasController from "./logic/InfoCanvasController";
import GhostModel from "./gameLogic/Models/GhostModel";
import {deg2rad} from "./math/Utils";


let canvas = new CanvasController("#mainCanvas");
let mapCanvas = new MapController({
    elementName: "#mapCanvas",
    translateMap: new Vector2([-220, 300]),
    scale: new Vector2([5, 5]),
    isRotate90: true
});
let infoCanvas = new InfoCanvasController({
    elementName: "#infoCanvas"
});
let scene = new GeneratedScene({
    canvasController: canvas,
    mapController: mapCanvas,
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
    position: new Vector3([2, 2, 0]),
    rotation: new Vector3([0, 0, 0])
});
let cameraModule = new CameraModule({
    fov: 60,
    near: 0.01,
    far: 1000
});
let flyCam = new FlyingCamera({
    movementSpeed: 5,
    sensitivity: 5
});
let pointOnMap = new DrawImageOnMap({
    mapController: mapCanvas,
    imageSrc: "pacman.png",
    size: new Vector2([10, 10]),
    canRotation: true
});
let collider = new CircleXZCollider({radius: 1, whenCollide: flyCam.repairPosition.bind(flyCam)});
cam.addModule(cameraModule);
cam.addModule(flyCam);
cam.addModule(collider);
cam.addModule(pointOnMap);
scene.addModel(cam);
cameraModule.setAsMainCamera();
scene.addModel(new GhostModel({
    position: new Vector3([-2, 1.8, 0]),
    rotation: new Vector3([0, deg2rad(-90), 0]),
    scale: new Vector3([1, 1, 1]),
    color: new Color([255, 184, 255, 1]),
    mapController: mapCanvas,
    scene: scene
}))
scene.start(() => {
    infoCanvas.clear();
    PointManager.instance.draw(infoCanvas)
});
