import Module from "../../logic/Module";
import MapController from "../../logic/MapController";
import Vector2 from "../../math/Vector2";
import Color from "../../math/Color";

export interface IDrawRectOnMap {
    mapController: MapController,
    size: Vector2;
    color?: Color;
}

export default class DrawRectOnMap extends Module {
    private mapController: MapController;
    private size: Vector2;
    private readonly color: Color;

    constructor({mapController, size, color}: IDrawRectOnMap) {
        super();
        this.mapController = mapController;
        this.size = size;
        this.color = color || Color.WHITE;
    }

    update(_: number): void {
        if (this.modelOwner == null) return;
        let posXZ = this.modelOwner.position.toVec2XZ();
        let size = this.size.mul(this.modelOwner.scale.toVec2XZ());
        this.mapController.drawRect(posXZ, size, this.color);
    }

}
