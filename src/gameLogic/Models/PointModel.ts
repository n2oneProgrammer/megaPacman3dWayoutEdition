import Vector3 from "../../math/Vector3";
import Model from "../../logic/Model";
import RenderModule from "../../logic/modules/RenderModule";
import {ballMesh} from "../../logic/BasicFigures";
import OneColorTexture from "../../logic/Textures/OneColorTexture";
import Color from "../../math/Color";
import MapController from "../../logic/MapController";
import DrawCircleOnMap from "../map/DrawCircleOnMap";
import CircleXZCollider from "../../logic/modules/Colliders/CircleXZCollider";
import Colliders from "../../logic/modules/Colliders";
import FlyingCamera from "../FlyingCamera";
import Scene from "../../logic/Scene";
import PointManager from "../PointManager";

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
        PointManager.instance.increaseMaxPoints();
        let ballRenderer = new RenderModule({
            mesh: ballMesh,
            texture: new OneColorTexture(Color.YELLOW)
        });
        this.addModule(ballRenderer);

        let collider = new CircleXZCollider({
            radius: 1,
            whenCollide: () => {
                let colliders = this.modules.filter(m => m instanceof Colliders && m.isCollide);
                if (colliders.length > 0) {
                    colliders.forEach(c => {
                        if (c instanceof CircleXZCollider) {
                            c.collisionsObjects.forEach((r) => {
                                if (r == c) return;
                                if (r.modelOwner != null && r.modelOwner.modules.find((m) => m instanceof FlyingCamera)) {
                                    if (this == null) return;
                                    Scene.instance.removeModel(this);
                                    PointManager.instance.collectPoint();
                                    PointManager.instance.addScore(200);
                                }
                            })
                        }
                    })
                }
            }
        });
        this.addModule(collider);

        if (mapController != null) {
            this.addModule(new DrawCircleOnMap({
                mapController: mapController,
                radius: 3,
                color: Color.YELLOW
            }))
        }
    }
}
