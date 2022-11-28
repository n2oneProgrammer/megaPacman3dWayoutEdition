import Scene from "../logic/Scene";
import GeneratedScene from "./GeneratedScene";
import GhostRoutine from "./levelData/GhostRoutine";
import {GhostState} from "./GhostState";
import Color from "../math/Color";
import Vector3 from "../math/Vector3";
import Vector2 from "../math/Vector2";
import GhostModel from "./Models/GhostModel";
import {deg2rad} from "../math/Utils";
import GhostAIComponent from "./GhostAIComponent";
import Quaternion from "../math/Quaternion";
import DiedGhostModel from "./Models/DiedGhostModel";
import MapController from "../logic/MapController";

let ghosts = [
    {
        color: new Color([255, 0, 0, 1]),//Blinky
        chaseCalcFunc: () => {
            return Scene.instance.mainCamera?.modelOwner?.position || Vector3.zero;
        },
        scatterTarget: new Vector3([-80, 0, -80])
    },
    {
        color: new Color([255, 184, 255, 1]),//Pinky
        chaseCalcFunc: () => {
            let modelOwner = Scene.instance.mainCamera?.modelOwner;
            if (modelOwner == null) return Vector3.zero;
            let vec = Quaternion.setFromEuler(modelOwner.rotation).mul(Vector3.forward) as Vector3;
            let v: Vector3;
            if (Math.abs(vec.x) < Math.abs(vec.z)) {
                v = new Vector3([0, 0, Math.sign(vec.z)]);
            } else {
                v = new Vector3([Math.sign(vec.x), 0, 0]);
            }
            return modelOwner.position.add(v.mul(-10));
        },
        scatterTarget: new Vector3([-80, 0, 80])
    },
    {
        color: new Color([0, 255, 255, 1]),//Inky
        chaseCalcFunc: () => {
            let redGhost = GhostManager.instance.ghostsModels[0];
            let pinkyGhost = GhostManager.instance.ghostsModels[1];
            let targetPinky = (pinkyGhost.modules.find(m => m instanceof GhostAIComponent) as GhostAIComponent).target || Vector3.zero;

            let v = targetPinky.sub(redGhost.position);
            return targetPinky.add(v);

        },
        scatterTarget: new Vector3([80, 0, -80])
    },
    {
        color: new Color([255, 184, 82, 1]),//Clyde
        chaseCalcFunc: () => {
            let pos = Scene.instance.mainCamera?.modelOwner?.position || Vector3.zero;
            if (pos.sub(GhostManager.instance.ghostsModels[3].position).lengthSquare() < 16 * 16) {
                return new Vector3([80, 0, 80])
            }
            return pos;
        },
        scatterTarget: new Vector3([80, 0, 80])
    }
]
export default class GhostManager {
    private static _instance: GhostManager | null = null;
    private spawnPoint: Vector3
    private times: [GhostState, number][] = [];
    private countGhostExist = 0;
    private eatableGhostTimer = 0;
    private eatableGhostTime: number = 25;
    private _ghostsModels: GhostModel[] = [];
    private gameTime: number;

    static get instance(): GhostManager {
        if (GhostManager._instance == null) {
            GhostManager._instance = new GhostManager();
        }
        return GhostManager._instance;
    }

    constructor() {
        this.gameTime = 0;
        let scene = Scene.instance as GeneratedScene;
        let spawn2d = scene.getBoardToPosition(new Vector2([2, 5]));
        this.spawnPoint = new Vector3([spawn2d.x, 1.8, spawn2d.y]);
        this.loadTimes((Scene.instance as GeneratedScene).level);
    }

    getState(): GhostState {
        if (this.eatableGhostTimer > 0) {
            return GhostState.FRIGHTENED;
        }

        for (let i = 0; i < this.times.length; i++) {
            if (this.gameTime < this.times[i][1]) {
                return this.times[i][0];
            }
        }
        return GhostState.CHASE;
    }

    update(deltaTime: number) {
        this.gameTime += deltaTime;
        this.eatableGhostTimer -= deltaTime;
        if (this.countGhostExist >= ghosts.length) {
            return;
        }
        if (this.gameTime >= this.countGhostExist * this.times[0][1] / ghosts.length) {
            let ghostData = ghosts[this.countGhostExist];
            this.spawnGhost(ghostData.color, ghostData.chaseCalcFunc, ghostData.scatterTarget);
            this.countGhostExist++;
        }
    }

    spawnGhost(color: Color, chaseCalcFunc: () => Vector3, scatterTarget: Vector3) {
        let scene = Scene.instance as GeneratedScene;
        let ghost = new GhostModel({
            position: this.spawnPoint,
            rotation: new Vector3([0, deg2rad(-90), 0]),
            scale: new Vector3([1, 1, 1]),
            color: color,
            mapController: scene.mapController!,
            scene: scene
        });
        ghost.addModule(new GhostAIComponent({
            movementSpeed: 5,
            chaseCalcFunc: chaseCalcFunc,
            scatterTarget: scatterTarget
        }));
        scene.addModel(ghost)
        this._ghostsModels.push(ghost);
    }

    private loadTimes(level: number) {
        let times = GhostRoutine(level);
        let result: [GhostState, number][] = [];
        let time = 0;
        for (let i = 0; i < times.length; i++) {
            if (times[i][1] == -1) {
                time = Infinity;
            }
            time += times[i][1];
            result.push([times[i][0], time]);
        }
        console.log(result);
        this.times = result;
    }

    get ghostsModels(): GhostModel[] {
        return this._ghostsModels;
    }

    activeEatableGhosts() {
        this.eatableGhostTimer = this.eatableGhostTime;
    }

    die(ghost: GhostModel) {
        ghost.disable();
        let scene = Scene.instance;
        let tempEyes = new DiedGhostModel({
            position: ghost.position.copy(),
            rotation: Vector3.zero,
            scale: Vector3.one,
            mapController: scene.mapController as MapController,
            ghost: ghost,
            target: this.spawnPoint,
            movementSpeed: 10,
            scene: scene as GeneratedScene
        });
        scene.addModel(tempEyes);
        ghost.position = new Vector3([100, 100, 100]);
    }

    activateGhost(ghost: GhostModel) {
        ghost.position = this.spawnPoint;
        ghost.activate();

    }
}
