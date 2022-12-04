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
    public mapBoard: maskType[][] = [];
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
        this.stepOfFindingPath(positionOnBoard, prevPosition, 0);

        let el = this.nearestElement.element;
        while (el != null && el.prevPos != null && el.steps > 1) {
            el = this.getElementPathBoard(el.prevPos.x, el.prevPos.y)
        }
        if (el?.pos.equal(positionOnBoard)) {
            return this.moveAny(positionOnBoard, prevPosition);
        }

        return el?.pos;
    }

    moveAny(position: Vector2, prevPosition: Vector2) {
        if (this.mapBoard[position.x] == null) return;
        let mask = this.mapBoard[position.x][position.y];
        let moves = []
        if ((mask & 1) == 0 && prevPosition.x != position.x - 1 && position.x - 1 >= 0) {
            moves.push(position.add(new Vector2([-1, 0])));
        }
        if ((mask & 2) == 0 && prevPosition.y != position.y + 1 && position.y + 1 < this.mapBoard[0].length) {
            moves.push(position.add(new Vector2([0, 1])));
        }
        if ((mask & 4) == 0 && prevPosition.x != position.x + 1 && position.x + 1 < this.mapBoard.length) {
            moves.push(position.add(new Vector2([1, 0])));
        }
        if ((mask & 8) == 0 && prevPosition.y != position.y - 1 && position.y - 1 >= 0) {
            moves.push(position.add(new Vector2([0, -1])));
        }
        return moves[Math.floor(Math.random() * moves.length)];
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
