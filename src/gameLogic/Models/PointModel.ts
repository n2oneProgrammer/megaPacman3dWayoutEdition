import Vector3 from "../../math/Vector3";
import Model from "../../logic/Model";
import RenderModule from "../../logic/modules/RenderModule";
import {ballMesh} from "../../logic/BasicFigures";
import OneColorTexture from "../../logic/Textures/OneColorTexture";
import Color from "../../math/Color";
import MapController from "../../logic/MapController";
import DrawCircleOnMap from "../map/DrawCircleOnMap";

export interface IPointModel {
    position: Vector3,
    mapController: MapController | null
}

export default class PointModel extends Model {
    constructor({position, mapController}: IPointModel) {
        super({
            position,
            rotation: Vector3.zero,
            scale: new Vector3([0.5, 0.5, 0.5])
        });
        let ballRenderer = new RenderModule({
            mesh: ballMesh,
            texture: new OneColorTexture(Color.YELLOW)
        });
        this.addModule(ballRenderer);
        if (mapController != null) {
            this.addModule(new DrawCircleOnMap({
                mapController: mapController,
                radius: 4,
                color: Color.YELLOW
            }))
        }
    }
}
