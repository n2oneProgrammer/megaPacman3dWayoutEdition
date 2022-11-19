import CanvasController from "./CanvasController.js";
import Model from "./Model.js";
import CameraModule from "./modules/CameraModule";
import InputService from "./services/InputService";
import MapController from "./MapController";

export default class Scene {
    private static _instance: Scene;
    private canvasController: CanvasController;
    private _models: Model[];
    private isRunning: boolean;
    private lastTime: number;
    private timeScale = 1;
    private _mainCamera: CameraModule | null = null;
    private _mapController: MapController | null = null;

    constructor(canvasController: CanvasController) {
        Scene._instance = this;
        InputService.instance;
        this.canvasController = canvasController;
        this.isRunning = false;
        this.lastTime = -1;
        this._models = [];
    }

    public start(func: ((deltaTime: number) => void)) {
        this.isRunning = true;
        this.gameLoop(func);
        this.lastTime = Date.now();
    }

    public stop() {
        this.isRunning = false;
    }

    public addModel(model: Model) {
        this._models.push(model);
    }

    public gameLoop(func: ((deltaTime: number) => void)) {
        if (!this.isRunning) return;
        let delta = (Date.now() - this.lastTime) / 1000 * this.timeScale;
        this.lastTime = Date.now();
        let gl = this.canvasController.canvasCtx;

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearColor(0.5, 0.5, 0.5, 0.9);
        gl.clearDepth(1.0);

        gl.viewport(0.0, 0.0, this.canvasController.canvasDOM.width, this.canvasController.canvasDOM.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (this._mapController !== null) this._mapController.clear();
        this._models.forEach(m => m.update(delta));
        func(delta);
        InputService.instance.resetMovement();
        requestAnimationFrame(() => this.gameLoop(func));
    }

    addMapController(mapController: MapController) {
        this._mapController = mapController;
    }

    static get instance(): Scene {
        return this._instance;
    }

    get models(): Model[] {
        return this._models;
    }

    get mapController(): MapController | null {
        return this._mapController;
    }

    get mainCamera(): CameraModule | null {
        return this._mainCamera;
    }

    set mainCamera(value: CameraModule | null) {
        this._mainCamera = value;
    }

    removeModel(model: Model) {
        this._models = this._models.filter((m) => m != model);
    }
}
