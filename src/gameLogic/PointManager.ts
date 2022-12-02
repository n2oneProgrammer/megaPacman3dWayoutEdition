import Vector2 from "../math/Vector2";
import Color from "../math/Color";
import InfoCanvasController from "../logic/InfoCanvasController";
import Scene from "../logic/Scene";
import GeneratedScene from "./GeneratedScene";

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
        PointManager._instance = this;
        this.maxPoints = 0;
        this.collectedPoints = 0;
        this._score = -200;
    }

    increaseMaxPoints() {
        this.maxPoints++;
    }

    collectPoint() {
        this.collectedPoints++;
        if (this.collectedPoints >= this.maxPoints) {
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
}
