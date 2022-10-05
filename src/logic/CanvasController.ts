export default class CanvasController {
    private canvasDOM: HTMLCanvasElement;
    private canvasCtx: WebGLRenderingContext;

    constructor(elementName: string) {
        let canvasDOM = document.querySelector<HTMLCanvasElement>(elementName);
        if (canvasDOM == null) {
            throw new Error("Invalid name")
        }
        this.canvasDOM = canvasDOM;
        let ctx = this.canvasDOM.getContext("webgl");
        if (ctx == null) {
            throw new Error("Problem with create Context")
        }
        this.canvasCtx = ctx;
        // Set clear color to black, fully opaque
        this.canvasCtx.clearColor(0.0, 0.0, 0.0, 1.0);
        // Clear the color buffer with specified clear color
        this.canvasCtx.clear(this.canvasCtx.COLOR_BUFFER_BIT);
    }

}