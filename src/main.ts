import CanvasController from "./logic/CanvasController.js";
import MapController from "./logic/MapController";
import Vector2 from "./math/Vector2";
import InfoCanvasController from "./logic/InfoCanvasController";
import Game from "./gameLogic/GameStages/Game";


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
let game = new Game({
    canvas, mapCanvas, infoCanvas
});
game.initGame();
