import Module from "../../logic/Module";
import MapController from "../../logic/MapController";
import Vector2 from "../../math/Vector2";
import Color from "../../math/Color";

export interface IDrawRectOnMap {
    mapController: MapController,
    size: Vector2;
}

export default class DrawRectOnMap extends Module {
    private mapController: MapController;
    private size: Vector2;

    constructor({mapController, size}: IDrawRectOnMap) {
        super();
        this.mapController = mapController;
        this.size = size;
    }

    update(_: number): void {
        if (this.modelOwner == null) return;
        let posXZ = this.modelOwner.position.toVec2XZ();
        let size = this.size.mul(this.modelOwner.scale.toVec2XZ());
        this.mapController.drawRect(posXZ, size, Color.WHITE);
    }

}
