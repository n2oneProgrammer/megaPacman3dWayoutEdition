import Model from "../../logic/Model";
import Vector3 from "../../math/Vector3";
import Color from "../../math/Color";
import RenderModule from "../../logic/modules/RenderModule";
import {ballMesh, ghostMesh} from "../../logic/BasicFigures";
import OneColorTexture from "../../logic/Textures/OneColorTexture";
import DrawCircleOnMap from "../map/DrawCircleOnMap";
import MapController from "../../logic/MapController";
import Scene from "../../logic/Scene";
import Quaternion from "../../math/Quaternion";
import CircleXZCollider from "../../logic/modules/Colliders/CircleXZCollider";
import Colliders from "../../logic/modules/Colliders";
import FlyingCamera from "../FlyingCamera";
import GeneratedScene from "../GeneratedScene";

export interface IGhostModel {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    mapController: MapController;
    color: Color;
    scene: Scene;
}

export default class GhostModel extends Model {
    private eyeLeft!: Model;
    private eyeRight!: Model;

    constructor({position, rotation, scale, color, mapController, scene}: IGhostModel) {
        super({
            position, rotation, scale
        });
        this.generateEye(scene);
        // this.color = color;
        let ghostRenderer = new RenderModule({
            mesh: ghostMesh,
            texture: new OneColorTexture(color)
        });
        this.addModule(ghostRenderer);
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
                                    (Scene.instance as GeneratedScene).loseLevel();
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
                radius: 5,
                color: color
            }))
        }
    }

    generateEye(scene: Scene) {
        this.eyeLeft = new Model({
            position: Vector3.zero,
            scale: new Vector3([0.2, 0.2, 0.2])
        });
        this.eyeLeft.addModule(new RenderModule({
            mesh: ballMesh,
            texture: new OneColorTexture(Color.BLACK)
        }))
        scene.addModel(this.eyeLeft);
        this.eyeRight = new Model({
            position: Vector3.zero,
            scale: new Vector3([0.2, 0.2, 0.2])
        });
        this.eyeRight.addModule(new RenderModule({
            mesh: ballMesh,
            texture: new OneColorTexture(Color.BLACK)
        }))
        scene.addModel(this.eyeRight);
        this.recalcPosition();
    }

    get position(): Vector3 {
        return super.position;
    }

    set position(value: Vector3) {
        super.position = value;
        this.recalcPosition();
    }

    recalcPosition() {
        this.eyeLeft.position = this.position.add(Quaternion.setFromEuler(this.rotation).mul(new Vector3([0.4, 0.4, 0.75])) as Vector3);
        this.eyeRight.position = this.position.add(Quaternion.setFromEuler(this.rotation).mul(new Vector3([-0.4, 0.4, 0.75])) as Vector3);
    }


}
