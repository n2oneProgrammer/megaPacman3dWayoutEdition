import Vector2 from "../math/Vector2";
import Color from "../math/Color";

export interface IInfoCanvasController {
    elementName: string;
}

export default class InfoCanvasController {
    private canvasDOM: HTMLCanvasElement;
    private canvasCtx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    constructor({elementName}: IInfoCanvasController) {
        let canvasDOM = document.querySelector<HTMLCanvasElement>(elementName);
        if (canvasDOM == null) throw new Error("Element must exist");
        this.canvasDOM = canvasDOM;
        this.width = this.canvasDOM.width;
        this.height = this.canvasDOM.height;
        let canvasCtx = this.canvasDOM.getContext("2d");
        if (canvasCtx == null) throw new Error("Element must exist");
        this.canvasCtx = canvasCtx;
    }

    clear() {
        this.canvasCtx.clearRect(0, 0, this.width, this.height);
    }

    drawRect(pos: Vector2, size: Vector2, color: Color) {
        let startPos = pos.sub(size)
        this.canvasCtx.fillStyle = color.toString();
        this.canvasCtx.fillRect(startPos.y, startPos.x, size.y, size.x);
    }

    drawCircle(pos: Vector2, radius: number, color: Color) {
        this.canvasCtx.fillStyle = color.toString();
        this.canvasCtx.beginPath();
        this.canvasCtx.fillStyle = color.toString();
        this.canvasCtx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        this.canvasCtx.fill();
    }

    drawImage(image: HTMLImageElement, pos: Vector2, rot: number, size: Vector2) {
        this.canvasCtx.save();
        this.canvasCtx.translate(pos.x, pos.y);
        this.canvasCtx.rotate(-rot);
        this.canvasCtx.drawImage(image, -size.x / 2, -size.y / 2, size.x, size.y);
        this.canvasCtx.restore();
    }

    drawText(text: string, pos: Vector2, size: number, color: Color) {
        this.canvasCtx.fillStyle = color.toString();
        this.canvasCtx.font = `${size}px sans-serif`;
        this.canvasCtx.fillText(text, pos.x, pos.y)
    }
}
