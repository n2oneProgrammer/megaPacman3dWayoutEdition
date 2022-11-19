import Module from "../logic/Module";
import Colliders from "../logic/modules/Colliders";
import FlyingCamera from "./FlyingCamera";
import CircleXZCollider from "../logic/modules/Colliders/CircleXZCollider";
import Scene from "../logic/Scene";
import PointManager from "./PointManager";


export default class PointComponent extends Module {
    update(_: number): void {
        if (this.modelOwner == null) return;
        let colliders = this.modelOwner.modules.filter(m => m instanceof Colliders && m.isCollide);
        if (colliders.length > 0) {
            colliders.forEach(c => {
                if (c instanceof CircleXZCollider) {
                    c.collisionsObjects.forEach((r) => {
                        if (r == c) return;
                        if (r.modelOwner != null && r.modelOwner.modules.find((m) => m instanceof FlyingCamera)) {
                            console.log("PLAYER");
                            if (this.modelOwner == null) return;
                            Scene.instance.removeModel(this.modelOwner);
                            PointManager.instance.collectPoint();
                            PointManager.instance.addScore(200);
                        }
                    })
                }
            })
        }

    }

}
