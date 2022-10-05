import CanvasController from "./CanvasController.js";
import Model from "./Model.js";

export default class Scene {
    private static _instance: Scene;
    private canvasController: CanvasController;
    private _models: Model[];
    private isRunning: boolean;
    private lastTime: number;
    private timeScale = 1;

    constructor(canvasController: CanvasController) {
        this.canvasController = canvasController;
        this.isRunning = false;
        this.lastTime = -1;
        this._models = [];
    }

    public start() {
        this.isRunning = true;
        this.gameLoop();
        this.lastTime = Date.now();
    }

    public stop() {
        this.isRunning = false;
    }

    public addModel(model: Model) {
        this._models.push(model);
    }

    public gameLoop() {
        if (!this.isRunning) return;
        let delta = (Date.now() - this.lastTime) / 1000 * this.timeScale;
        this.lastTime = Date.now();
        this._models.forEach(m => m.update(delta));
        requestAnimationFrame(() => this.gameLoop());
    }

    static get instance(): Scene {
        return this._instance;
    }

    get models(): Model[] {
        return this._models;
    }
}