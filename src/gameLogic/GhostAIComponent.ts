import Module from "../logic/Module";
import Vector2 from "../math/Vector2";
import Model from "../logic/Model";
import Scene from "../logic/Scene";
import PathFinder from "./PathFinder";
import GeneratedScene from "./GeneratedScene";
import Vector3 from "../math/Vector3";

export default class GhostAIComponent extends Module {
    private smallTarget: Vector2 | null;
    private prevPosition: Vector2 | null;
    private target: Model | null;
    private timer: number = 2;

    constructor() {
        super();
        this.smallTarget = null;
        this.prevPosition = null;
        this.target = Scene.instance.mainCamera?.modelOwner || null;
    }

    update(deltaTime: number): void {
        if (this.modelOwner == null) return;
        if (this.smallTarget == null) {
            this.findPath();
        }
        if (this.timer < 0) {
            this.prevPosition = new Vector2([this.modelOwner.position.x, this.modelOwner.position.z]);
            this.modelOwner.position = new Vector3([
                this.smallTarget?.x || 0,
                this.modelOwner.position.y,
                this.smallTarget?.y || 0
            ]);
            this.smallTarget = null;
            this.timer = 1;
        }
        this.timer -= deltaTime;
    }

    private findPath() {
        if (this.modelOwner == null) return;
        if (this.target == null) return;
        if (!(Scene.instance instanceof GeneratedScene)) return;
        let scene = Scene.instance as GeneratedScene;
        let pathFinder = new PathFinder();
        let positionOnBoard = scene.getPositionOnBoard(this.modelOwner.position.toVec2XZ());
        let prevPositionOnBoard = this.prevPosition != null ? scene.getPositionOnBoard(this.prevPosition) : positionOnBoard;
        let targetOnBoard = scene.getPositionOnBoard(this.target.position.toVec2XZ());
        let newTarget = pathFinder.findPath(
            positionOnBoard,
            prevPositionOnBoard,
            scene.mapMask,
            new Vector2([Math.round(targetOnBoard.x), Math.round(targetOnBoard.y)])
        );
        this.smallTarget = scene.getBoardToPosition(newTarget || Vector2.zero);
    }

}
