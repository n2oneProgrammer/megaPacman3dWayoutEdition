import Module from "../../logic/Module";
import MapController from "../../logic/MapController";
import Color from "../../math/Color";

export interface IDrawCircleOnMap {
    mapController: MapController,
    radius: number;
    color?: Color;
}

export default class DrawCircleOnMap extends Module {
    private mapController: MapController;
    private readonly radius: number;
    private _color: Color;

    constructor({mapController, radius, color}: IDrawCircleOnMap) {
        super();
        this.mapController = mapController;
        this.radius = radius;
        this._color = color || Color.WHITE;
    }

    update(_: number): void {
        if (this.modelOwner == null) return;
        let posXZ = this.modelOwner.position.toVec2XZ();
        this.mapController.drawCircle(posXZ, this.radius, this._color);
    }

    get color(): Color {
        return this._color;
    }

    set color(value: Color) {
        this._color = value;
    }
}
