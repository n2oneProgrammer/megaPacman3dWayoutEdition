export default class CanvasController {
    private _canvasDOM: HTMLCanvasElement;
    private _canvasCtx: WebGLRenderingContext;
    private static _instance: CanvasController | null = null;
    private _proj_matrix: number[];
    private _view_matrix: number[];

    constructor(elementName: string) {
        CanvasController._instance = this;
        let canvasDOM = document.querySelector<HTMLCanvasElement>(elementName);
        if (canvasDOM == null) {
            throw new Error("Invalid name")
        }
        this._canvasDOM = canvasDOM;
        let ctx = this._canvasDOM.getContext("webgl2");
        if (ctx == null) {
            throw new Error("Problem with create Context")
        }
        this._canvasCtx = ctx;
        // Set clear color to black, fully opaque
        this._canvasCtx.clearColor(0.0, 0.0, 0.0, 1.0);
        // Clear the color buffer with specified clear color
        this._canvasCtx.clear(this._canvasCtx.COLOR_BUFFER_BIT);

        this._proj_matrix = this.get_projection(40, this._canvasDOM.width / this._canvasDOM.height, 1, 100);

        this._view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        // translating z
        this._view_matrix[14] = this._view_matrix[14] - 6;//zoom
    }

    static get instance(): CanvasController | null {
        return this._instance;
    }

    get_projection(angle: number, a: number, zMin: number, zMax: number) {
        var ang = Math.tan((angle * .5) * Math.PI / 180);//angle*.5
        return [
            0.5 / ang, 0, 0, 0,
            0, 0.5 * a / ang, 0, 0,
            0, 0, -(zMax + zMin) / (zMax - zMin), -1,
            0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
        ];
    }

    get canvasDOM(): HTMLCanvasElement {
        return this._canvasDOM;
    }

    get canvasCtx(): WebGLRenderingContext {
        return this._canvasCtx;
    }

    get proj_matrix(): number[] {
        return this._proj_matrix;
    }

    get view_matrix(): number[] {
        return this._view_matrix;
    }

    getAspect() {
        return this._canvasDOM.width / this._canvasDOM.height;
    }
}
