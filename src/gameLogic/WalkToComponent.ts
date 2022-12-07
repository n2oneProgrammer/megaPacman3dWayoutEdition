import Module from "../logic/Module";
import Vector2 from "../math/Vector2";
import Scene from "../logic/Scene";
import PathFinder from "./PathFinder";
import GeneratedScene from "./GeneratedScene";
import Vector3 from "../math/Vector3";

export interface IWalkToComponent {
    movementSpeed: number;
    target: Vector3;
    whenFinish: () => void;
}

export default class WalkToComponent extends Module {
    private smallTarget: Vector2 | null;
    private prevPosition: Vector2 | null;
    private readonly _target: Vector3;
    private movementSpeed: number;
    private whenFinish: () => void;

    constructor({movementSpeed, target, whenFinish}: IWalkToComponent) {
        super();
        this.movementSpeed = movementSpeed;
        this.whenFinish = whenFinish;
        this._target = target;
        console.log("TARGET", target)
        this.smallTarget = null;
        this.prevPosition = null;
    }

    update(deltaTime: number): void {
        if (this.modelOwner == null) return;
        if (this.smallTarget == null) {
            this.findPath();
            this.prevPosition = new Vector2([this.modelOwner.position.x, this.modelOwner.position.z]);
        }
        let moveVector = new Vector3([
            this.smallTarget?.x || 0,
            this.modelOwner.position.y,
            this.smallTarget?.y || 0
        ]).sub(this.modelOwner.position);
        if (moveVector.x != 0 && moveVector.z != 0) {
            this.smallTarget = null;
            return;
        }
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
        if (this._target.sub(this.modelOwner.position).lengthSquare() < 0.01) {
            this.whenFinish();
        }
    }

    private findPath() {
        if (this.modelOwner == null) return;
        if (!(Scene.instance instanceof GeneratedScene)) return;
        let scene = Scene.instance as GeneratedScene;
        let pathFinder = new PathFinder();
        let positionOnBoard = scene.getPositionOnBoard(this.modelOwner.position.toVec2XZ());
        let prevPositionOnBoard = this.prevPosition != null ? scene.getPositionOnBoard(this.prevPosition) : positionOnBoard;
        let targetOnBoard = scene.getPositionOnBoard(this._target.toVec2XZ());
        let newTarget = pathFinder.findPath(
            positionOnBoard,
            prevPositionOnBoard,
            scene.mapMask,
            new Vector2([Math.round(targetOnBoard.x), Math.round(targetOnBoard.y)])
        );
        this.smallTarget = scene.getBoardToPosition(newTarget || Vector2.zero);

    }
}
