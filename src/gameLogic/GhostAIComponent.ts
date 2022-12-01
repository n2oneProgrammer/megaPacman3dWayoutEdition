import Module from "../logic/Module";
import Vector2 from "../math/Vector2";
import Scene from "../logic/Scene";
import PathFinder from "./PathFinder";
import GeneratedScene from "./GeneratedScene";
import Vector3 from "../math/Vector3";
import GhostManager from "./GhostManager";
import {GhostState} from "./GhostState";
import GhostModel from "./Models/GhostModel";

export interface IGhostAIComponent {
    movementSpeed: number;
    chaseCalcFunc: () => Vector3;
    scatterTarget: Vector3;
    id: number;
}

export default class GhostAIComponent extends Module {
    private smallTarget: Vector2 | null;
    private prevPosition: Vector2 | null;
    private _target: Vector3 | null;
    private movementSpeed: number;
    private chaseCalcFunc: () => Vector3;
    private scatterTarget: Vector3;
    private isFrightened: boolean = false;
    private id: number;

    constructor({movementSpeed, chaseCalcFunc, scatterTarget, id}: IGhostAIComponent) {
        super();
        this.movementSpeed = movementSpeed;
        this.chaseCalcFunc = chaseCalcFunc;
        this.scatterTarget = scatterTarget;
        this.id = id;
        this.smallTarget = null;
        this.prevPosition = null;
        this._target = new Vector3([0, 0, 0]) || null;
    }

    calcTarget() {
        let state = GhostManager.instance.getState(this.id);
        // console.log("STATE", state);
        if (state != GhostState.FRIGHTENED && this.isFrightened) {
            this.isFrightened = false;
            (this.modelOwner as GhostModel).change2NormalForm();

        }
        switch (state) {
            case GhostState.CHASE:
                this._target = this.chaseCalcFunc();
                break;
            case GhostState.SCATTER:
                this._target = this.scatterTarget;
                break;
            case GhostState.FRIGHTENED:
                if (!this.isFrightened) {
                    (this.modelOwner as GhostModel).change2Frightened();
                    let temp = this.smallTarget;
                    this.smallTarget = this.prevPosition;
                    this.prevPosition = temp;
                }
                this.isFrightened = true;
                this._target = this.scatterTarget;
                break;
        }
    }

    randomWall() {
        if (this.modelOwner == null) return;
        if (!(Scene.instance instanceof GeneratedScene)) return;
        let scene = Scene.instance as GeneratedScene;
        let positionOnBoard = scene.getPositionOnBoard(this.modelOwner.position.toVec2XZ());
        let prevPositionOnBoard = this.prevPosition != null ? scene.getPositionOnBoard(this.prevPosition) : positionOnBoard;
        let pathFinder = new PathFinder();
        pathFinder.mapBoard = scene.mapMask;
        let newTarget = pathFinder.moveAny(positionOnBoard, prevPositionOnBoard);
        this.smallTarget = scene.getBoardToPosition(newTarget || Vector2.zero);
    }

    update(deltaTime: number): void {
        if (this.modelOwner == null) return;
        if (!(this.modelOwner as GhostModel).enable) {
            this.smallTarget = null;
            return;
        }
        this.calcTarget();
        if (this.smallTarget == null) {
            if (this.isFrightened) {
                this.randomWall();
            } else {
                this.findPath();
            }
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
