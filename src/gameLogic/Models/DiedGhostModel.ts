import Model from "../../logic/Model";
import Vector3 from "../../math/Vector3";
import Color from "../../math/Color";
import RenderModule from "../../logic/modules/RenderModule";
import {ballMesh} from "../../logic/BasicFigures";
import OneColorTexture from "../../logic/Textures/OneColorTexture";
import MapController from "../../logic/MapController";
import Scene from "../../logic/Scene";
import Quaternion from "../../math/Quaternion";
import GhostModel from "./GhostModel";
import WalkToComponent from "../WalkToComponent";
import GhostManager from "../GhostManager";
import GeneratedScene from "../GeneratedScene";
import Vector2 from "../../math/Vector2";
import DrawImageOnMap from "../map/DrawImageOnMap";

export interface IDiedGhostModel {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
    mapController: MapController;
    ghost: GhostModel;
    target: Vector3;
    scene: GeneratedScene;
    movementSpeed: number;
}

export default class DiedGhostModel extends Model {
    private eyeLeft!: Model;
    private eyeRight!: Model;

    constructor({position, rotation, scale, ghost, target, mapController, scene, movementSpeed}: IDiedGhostModel) {
        let p = scene.getPositionOnBoard(position.toVec2XZ())
        let pos = scene.getBoardToPosition(new Vector2([Math.round(p.x), Math.round(p.y)]))
        super({
            position: new Vector3([pos.x, position.y, pos.y]), rotation, scale
        });
        this.generateEye(scene);
        this.addModule(new WalkToComponent({
            movementSpeed: movementSpeed,
            target: target,
            whenFinish: () => {
                this.deleteEyes(Scene.instance);
                Scene.instance.removeModel(this);
                GhostManager.instance.activateGhost(ghost);
            }
        }))
        if (mapController != null) {
            this.addModule( new DrawImageOnMap({
                mapController: mapController,
                imageSrc: "eye.png",
                size: new Vector2([10, 5]),
                canRotation: true
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

    deleteEyes(scene: Scene) {
        scene.removeModel(this.eyeLeft);
        scene.removeModel(this.eyeRight);
    }

}
