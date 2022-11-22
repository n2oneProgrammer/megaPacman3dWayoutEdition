import Module from "../logic/Module";
import Vector2 from "../math/Vector2";
import Model from "../logic/Model";
import Scene from "../logic/Scene";
import PathFinder from "./PathFinder";
import GeneratedScene from "./GeneratedScene";
import Vector3 from "../math/Vector3";

export interface IGhostAIComponent {
    movementSpeed: number;
}

export default class GhostAIComponent extends Module {
    private smallTarget: Vector2 | null;
    private prevPosition: Vector2 | null;
    private target: Model | null;
    private movementSpeed: number;

    constructor({movementSpeed}: IGhostAIComponent) {
        super();
        this.movementSpeed = movementSpeed;
        this.smallTarget = null;
        this.prevPosition = null;
        this.target = Scene.instance.mainCamera?.modelOwner || null;
    }

    update(deltaTime: number): void {
        if (this.modelOwner == null) return;
        if (this.smallTarget == null) {
            this.findPath();
            console.log("ZACZYNAM");
            this.prevPosition = new Vector2([this.modelOwner.position.x, this.modelOwner.position.z]);
        }
        let moveVector = new Vector3([
            this.smallTarget?.x || 0,
            this.modelOwner.position.y,
            this.smallTarget?.y || 0
        ]).sub(this.modelOwner.position);
        this.modelOwner.rotation = new Vector3([
            this.modelOwner.rotation.x,
            Math.atan2(moveVector.x, moveVector.z),
            this.modelOwner.rotation.z
        ])

        this.modelOwner.position = this.modelOwner.position.add(moveVector.normalize().mul(this.movementSpeed * deltaTime));
        if (moveVector.lengthSquare() < 0.01) {
            this.modelOwner.position = new Vector3([
                this.smallTarget?.x || 0,
                this.modelOwner.position.y,
                this.smallTarget?.y || 0
            ]);
            this.smallTarget = null;
        }
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
