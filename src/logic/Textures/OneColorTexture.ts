import Texture from "./Texture";
import Color from "../../math/Color";

export default class OneColorTexture extends Texture {
    private color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }

    calculatingColor(vertices: number[]) {
        this._colorVertices = [];
        for (let i = 0; i < vertices.length / 3; i++) {
            this._colorVertices.push(this.color.r / 255, this.color.g / 255, this.color.b / 255);
        }
    }

}
