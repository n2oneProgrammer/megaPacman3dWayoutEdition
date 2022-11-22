import Vector2 from "../math/Vector2";
import {maskType} from "./GeneratedScene";

export class PathfindingField {
    pos: Vector2;
    prevPos: Vector2 | null
    steps: number;

    constructor(pos: Vector2, prevElement: Vector2 | null, steps: number) {
        this.pos = pos;
        this.prevPos = prevElement;
        this.steps = steps
    }
}

export default class PathFinder {
    private pathBoard: PathfindingField[][] = [];
    private mapBoard: maskType[][] = [];
    private nearestElement: { distance: number, element: PathfindingField | null } = {
        distance: Infinity,
        element: null
    };
    private target: Vector2 = Vector2.zero;

    private getElementPathBoard(x: number, y: number) {
        if (this.pathBoard[x] == null) return null;
        return this.pathBoard[x][y];
    }

    private setElementPathBoard(x: number, y: number, value: PathfindingField) {
        if (this.pathBoard[x] == null) this.pathBoard[x] = []
        this.pathBoard[x][y] = value
    }

    findPath(positionOnBoard: Vector2, prevPosition: Vector2, mapBoard: maskType[][], target: Vector2) {
        this.pathBoard = [];
        this.mapBoard = mapBoard;
        this.target = target;
        console.log(mapBoard, positionOnBoard, prevPosition, target)
        this.stepOfFindingPath(positionOnBoard, prevPosition, 0);
        console.table(this.pathBoard.map(row => row.map(el => el.steps)));
        console.log(this.nearestElement);

        let el = this.nearestElement.element;
        while (el != null && el.prevPos != null && el.steps > 1) {
            console.log(el.steps, el.prevPos, el.pos);
            el = this.getElementPathBoard(el.prevPos.x, el.prevPos.y)
        }

        return el?.pos;
    }

    private stepOfFindingPath(position: Vector2, prevPosition: Vector2, step: number) {
        if (this.mapBoard[position.x] == null) return;
        let mask = this.mapBoard[position.x][position.y];
        let el = this.getElementPathBoard(position.x, position.y);
        if (mask == null || (el != null && el.steps < step)) return;
        this.setElementPathBoard(position.x, position.y, new PathfindingField(
            position, prevPosition, step
        ));
        let dist = this.target.sub(position).lengthSq();
        if (dist < this.nearestElement.distance) {
            this.nearestElement = {
                distance: dist,
                element: this.getElementPathBoard(position.x, position.y)
            };
        }
        if ((mask & 1) == 0 && prevPosition.x != position.x - 1) {
            this.stepOfFindingPath(
                position.add(new Vector2([-1, 0])),
                position,
                step + 1
            )
        }
        if ((mask & 2) == 0 && prevPosition.y != position.y + 1) {
            this.stepOfFindingPath(
                position.add(new Vector2([0, 1])),
                position,
                step + 1
            )
        }
        if ((mask & 4) == 0 && prevPosition.x != position.x + 1) {
            this.stepOfFindingPath(
                position.add(new Vector2([1, 0])),
                position,
                step + 1
            )
        }
        if ((mask & 8) == 0 && prevPosition.y != position.y - 1) {
            this.stepOfFindingPath(
                position.add(new Vector2([0, -1])),
                position,
                step + 1
            )
        }
    }

}
