import Vector2 from "../math/Vector2";
import Color from "../math/Color";
import InfoCanvasController from "../logic/InfoCanvasController";
import Scene from "../logic/Scene";
import GeneratedScene from "./GeneratedScene";
import PointModel from "./Models/PointModel";
import FoodModel from "./Models/FoodModel";

export default class PointManager {
    private static _instance: PointManager | null = null
    private _score: number;
    private maxPoints: number;
    private collectedPoints: number;

    static get instance(): PointManager {
        if (this._instance == null) this._instance = new PointManager();
        return this._instance;
    }

    constructor() {
        this.maxPoints = 0;
        this.collectedPoints = 0;
        this._score = -10;
    }

    increaseMaxPoints() {
        this.maxPoints++;
    }

    collectPoint() {
        this.collectedPoints++;
        console.log(this.collectedPoints, this.maxPoints);
        if (!Scene.instance.models.some(m => m instanceof PointModel || m instanceof FoodModel)) {
            (Scene.instance as GeneratedScene).winLevel()
        }
    }

    addScore(score: number) {
        this._score += score;
    }

    draw(infoCanvas: InfoCanvasController) {
        infoCanvas.drawText("Your score: " + this._score, new Vector2([0, 30]), 30, Color.WHITE);
    }

    decreasePoints() {
        this.maxPoints--;
    }

    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
    }

    restart() {
        this.maxPoints = 0;
        this._score = -200;
        this.collectedPoints = 0;
        PointManager._instance = null;
    }
}
