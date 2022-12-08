import GeneratedScene from "../GeneratedScene";
import Color from "../../math/Color";
import Vector3 from "../../math/Vector3";
import Model from "../../logic/Model";
import CameraModule from "../../logic/modules/CameraModule";
import FlyingCamera from "../FlyingCamera";
import DrawImageOnMap from "../map/DrawImageOnMap";
import Vector2 from "../../math/Vector2";
import CircleXZCollider from "../../logic/modules/Colliders/CircleXZCollider";
import GhostManager from "../GhostManager";
import PointManager from "../PointManager";
import CanvasController from "../../logic/CanvasController";
import MapController from "../../logic/MapController";
import InfoCanvasController from "../../logic/InfoCanvasController";
import InputService from "../../logic/services/InputService";
import {EventType} from "../../logic/enum/EventType";
import LevelDrawer from "../LevelDrawer";
import Colliders from "../../logic/modules/Colliders";
import SoundManager from "../../logic/SoundManager";

export interface IGame {
    canvas: CanvasController;
    mapCanvas: MapController;
    infoCanvas: InfoCanvasController
}

export default class Game {
    public static instance: Game;
    private mapCanvas: MapController;
    private canvas: CanvasController;
    private infoCanvas: InfoCanvasController;
    private scene!: GeneratedScene;
    private signatureFocus: OmitThisParameter<() => void> = () => {
    };
    private signatureBlur: OmitThisParameter<() => void> = () => {
    };
    private firstClick: boolean;
    private firstStart: boolean = false;

    constructor({canvas, mapCanvas, infoCanvas}: IGame) {
        Game.instance = this;
        this.canvas = canvas;
        this.mapCanvas = mapCanvas;
        this.infoCanvas = infoCanvas;
        this.firstClick = false;
        InputService.instance.registerEvent(EventType.MOUSE_CLICK, () => {
            if (this.firstClick) return;
            this.firstClick = true;
            SoundManager.instance.play("./sound/pacman_beginning.wav", true);
        })
    }

    loadGame(level: number) {
        PointManager.instance.restart();
        InputService.instance.restart();
        let mapMask = [
            [0, 4, 2, 8, 4, 4, 4, 4, 2, 8, 4, 0],
            [2, 9, 4, 0, 5, 1, 1, 5, 0, 4, 3, 8],
            [0, 0, 5, 2, 13, 4, 4, 7, 8, 5, 0, 0],
            [2, 12, 1, 0, 5, 5, 5, 5, 0, 1, 6, 8],
            [0, 1, 2, 8, 1, 1, 1, 1, 2, 8, 1, 0]

        ]
        this.scene = new GeneratedScene({
            canvasController: this.canvas,
            mapController: this.mapCanvas,
            mapMask: mapMask,
            level: level,
            tileSize: 3,
            wallHeight: 2,
            wallColor: new Color([14, 138, 245, 255]),
            floorColor: Color.BLACK
        });
        this.scene.createWall(
            new Vector3([-3, 0.5 + 1, 3]),
            new Color([7, 69, 122, 255]),
            new Vector3([0.25, 2, 3])
        )
        this.scene.createWall(
            new Vector3([-3, 0.5 + 1, -3]),
            new Color([7, 69, 122, 255]),
            new Vector3([0.25, 2, 3])
        )
// let scene = new Scene(canvas);
        let cam = new Model({
            position: new Vector3([6, 2, 0]),
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
            mapController: this.mapCanvas,
            imageSrc: "pacman.png",
            size: new Vector2([10, 10]),
            canRotation: true
        });
        let collider = new CircleXZCollider({radius: 1, whenCollide: flyCam.repairPosition.bind(flyCam)});
        cam.addModule(cameraModule);
        cam.addModule(flyCam);
        cam.addModule(collider);
        cam.addModule(pointOnMap);
        this.scene.addModel(cam);
        cameraModule.setAsMainCamera();
        GhostManager.instance.reload();
    }

    initGame(level: number) {
        this.loadGame(level);
        this.signatureFocus = this.onFocus.bind(this);
        this.signatureBlur = this.onBlur.bind(this);
        this.scene.start(this.update.bind(this));
        setTimeout(() => {
            this.generateRightPanel();
            this.scene.stop()
        }, 100);
        InputService.instance.registerEvent(EventType.KEYBOARD_CLICK, (e: Event) => {
            let event = e as KeyboardEvent;
            if (event.key === " ") {
                if (this.firstStart) return;
                this.firstStart = true;
                document.getElementById("PlayStartInfo")!.style.display = "none";
                SoundManager.instance.play("./sound/pacman_chomp2.wav", true);
                this.startGame();
            }
        });
    }

    generateRightPanel() {
        this.infoCanvas.clear();
        this.infoCanvas.drawText("Pacman wayout is a 3d game", new Vector2([10, 50]), 30, Color.WHITE);
        this.infoCanvas.drawText("created as a school project.", new Vector2([10, 100]), 30, Color.WHITE);
    }

    startGame() {
        this.scene.start(this.update.bind(this));
        window.addEventListener("focus", this.signatureFocus)
        window.addEventListener("blur", this.signatureBlur)
    }

    update(deltaTime: number) {
        this.infoCanvas.clear();
        GhostManager.instance.update(deltaTime);
        PointManager.instance.draw(this.infoCanvas);
        LevelDrawer(this.infoCanvas, new Vector2([5, 80]), this.scene.level);
    }

    nextLevel() {
        let level = this.scene.level;
        this.scene.models = [];
        Colliders.colliders = [];
        let score = PointManager.instance.score;
        this.remove();
        if (level + 1 > 20) {
            setTimeout(() => {
                SoundManager.instance.play("./sound/pacman_beginning.wav");
                this.infoCanvas.clear();
                this.infoCanvas.drawText("You win the game", new Vector2([10, 50]), 30, Color.WHITE);
                this.infoCanvas.drawText("Congratulations", new Vector2([10, 100]), 30, Color.WHITE);
                this.infoCanvas.drawText("Your Score " + PointManager.instance.score, new Vector2([10, 150]), 30, Color.WHITE);
            }, 100)

            return
        }
        setTimeout(() => {
            SoundManager.instance.play("./sound/pacman_intermission.wav");
            this.infoCanvas.drawText("Level Up", new Vector2([10, 150]), 30, Color.WHITE);
        }, 100)
        setTimeout(() => {
            this.loadGame(level + 1)
            PointManager.instance.score = score - 10;
            SoundManager.instance.play("./sound/chomp2.wav");
            this.scene.start(this.update.bind(this));
        }, 3000)
    }

    lose() {
        this.scene.stop();
        this.remove();
        setTimeout(() => {
            this.infoCanvas.clear();
            SoundManager.instance.play("./sound/pacman_death.wav");
            this.infoCanvas.drawText("You got caught by a ghost", new Vector2([10, 50]), 30, Color.WHITE);
            this.infoCanvas.drawText("Your Score " + PointManager.instance.score, new Vector2([10, 100]), 30, Color.WHITE);
        }, 100)

    }

    onBlur() {
        this.scene.stop();
    }

    onFocus() {
        this.scene.start(this.update.bind(this))
    }

    remove() {
        this.scene.stop();
        window.removeEventListener("focus", this.signatureFocus);
        window.removeEventListener("blur", this.signatureBlur);
    }
}
