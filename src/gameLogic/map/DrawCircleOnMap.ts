import Module from "../../logic/Module";
import MapController from "../../logic/MapController";
import Color from "../../math/Color";

export interface IDrawCircleOnMap {
    mapController: MapController,
    radius: number;
}

export default class DrawCircleOnMap extends Module {
    private mapController: MapController;
    private radius: number;

    constructor({mapController, radius}: IDrawCircleOnMap) {
        super();
        this.mapController = mapController;
        this.radius = radius;
    }

    update(_: number): void {
        if (this.modelOwner == null) return;
        let posXZ = this.modelOwner.position.toVec2XZ();
        this.mapController.drawCircle(posXZ, this.radius, Color.WHITE);
    }

}
