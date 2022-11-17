import Vector2 from "../math/Vector2";
import Color from "../math/Color";

export interface IMapController {
    elementName: string;
    translateMap: Vector2;
    scale: Vector2;
    isRotate90: boolean
}

export default class MapController {
    private canvasDOM: HTMLCanvasElement;
    private canvasCtx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private translateMap: Vector2;
    private scale: Vector2;
    private isRotate90: boolean;

    constructor({elementName, translateMap, scale, isRotate90}: IMapController) {
        let canvasDOM = document.querySelector<HTMLCanvasElement>(elementName);
        if (canvasDOM == null) throw new Error("Element must exist");
        this.canvasDOM = canvasDOM;
        this.width = this.canvasDOM.width;
        this.height = this.canvasDOM.height;
        let canvasCtx = this.canvasDOM.getContext("2d");
        if (canvasCtx == null) throw new Error("Element must exist");
        this.canvasCtx = canvasCtx;
        this.translateMap = translateMap;
        this.scale = scale;
        this.isRotate90 = isRotate90;
    }

    clear() {
        this.canvasCtx.clearRect(0, 0, this.width, this.height);
    }
    drawRect(pos: Vector2, size: Vector2, color: Color) {
        let startPos = pos.sub(size).mul(this.scale).add(this.translateMap).add(new Vector2([this.width / 2, this.height / 2]));
        let newSize = size.mul(2).mul(this.scale);
        this.canvasCtx.fillStyle = color.toString();
        if (this.isRotate90) {
            this.canvasCtx.fillRect(startPos.y, startPos.x, newSize.y, newSize.x);
        } else {
            this.canvasCtx.fillRect(startPos.x, startPos.y, newSize.x, newSize.y);
        }
    }

    drawCircle(pos: Vector2, radius: number, color: Color) {
        let startPos = pos.mul(this.scale).add(this.translateMap).add(new Vector2([this.width / 2, this.height / 2]));
        this.canvasCtx.fillStyle = color.toString();
        if (this.isRotate90) {
            startPos = new Vector2([startPos.y, startPos.x])
        }
        this.canvasCtx.beginPath();
        this.canvasCtx.fillStyle = color.toString();
        this.canvasCtx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        this.canvasCtx.fill();
    }

    drawImage(image: HTMLImageElement, pos: Vector2, rot: number, size: Vector2) {
        let startPos = pos.mul(this.scale).add(this.translateMap).add(new Vector2([this.width / 2, this.height / 2]));
        if (this.isRotate90) {
            startPos = new Vector2([startPos.y, startPos.x])
        }
        this.canvasCtx.save();
        this.canvasCtx.translate(startPos.x, startPos.y);
        this.canvasCtx.rotate(-rot);
        this.canvasCtx.drawImage(image, -size.x/2, -size.y/2, size.x, size.y);
        this.canvasCtx.restore();
    }
}
