import Module from "../logic/Module";
import Vector2 from "../math/Vector2";
import Scene from "../logic/Scene";
import PathFinder from "./PathFinder";
import GeneratedScene from "./GeneratedScene";
import Vector3 from "../math/Vector3";
import GhostManager from "./GhostManager";
import {GhostState} from "./GhostState";

export interface IGhostAIComponent {
    movementSpeed: number;
    chaseCalcFunc: () => Vector3;
    scatterTarget: Vector3;
}

export default class GhostAIComponent extends Module {
    private smallTarget: Vector2 | null;
    private prevPosition: Vector2 | null;
    private _target: Vector3 | null;
    private movementSpeed: number;
    private chaseCalcFunc: () => Vector3;
    private scatterTarget: Vector3;

    constructor({movementSpeed, chaseCalcFunc, scatterTarget}: IGhostAIComponent) {
        super();
        this.movementSpeed = movementSpeed;
        this.chaseCalcFunc = chaseCalcFunc;
        this.scatterTarget = scatterTarget;
        this.smallTarget = null;
        this.prevPosition = null;
        this._target = new Vector3([0, 0, 0]) || null;
    }

    calcTarget() {
        let state = GhostManager.instance.getState();
        // console.log("STATE", state);
        switch (state) {
            case GhostState.CHASE:
                this._target = this.chaseCalcFunc();
                break;
            case GhostState.SCATTER:
                // console.log("SCATTER");
                this._target = this.scatterTarget;
                break;
            case GhostState.FRIGHTENED:
                break;
        }
    }

    update(deltaTime: number): void {
        if (this.modelOwner == null) return;
        this.calcTarget();
        if (this.smallTarget == null) {
            this.findPath();
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
        if (this._target == null) return;
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
        // if (newTarget?.equal(positionOnBoard)) {
        //     let d = positionOnBoard.sub(prevPositionOnBoard);
        //     newTarget = positionOnBoard.add(d);
        // }
        this.smallTarget = scene.getBoardToPosition(newTarget || Vector2.zero);

    }

    get target(): Vector3 | null {
        return this._target;
    }
}
