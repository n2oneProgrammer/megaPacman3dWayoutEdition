import Scene from "../logic/Scene";
import CanvasController from "../logic/CanvasController";
import Model from "../logic/Model";
import Vector3 from "../math/Vector3";
import RenderModule from "../logic/modules/RenderModule";
import {cubeMesh} from "../logic/BasicFigures";
import OneColorTexture from "../logic/Textures/OneColorTexture";
import Color from "../math/Color";
import RectXZCollider from "../logic/modules/Colliders/RectXZCollider";
import Vector2 from "../math/Vector2";
import MapController from "../logic/MapController";
import DrawRectOnMap from "./map/DrawRectOnMap";
import GeneratingPointsModule from "./GeneratingPointsModule";
import Game from "./GameStages/Game";

export type maskType = number; // 1 - up, 2 - right, 4 - down, 8 - left

export interface IMapGenerator {
    canvasController: CanvasController;
    mapController: MapController;
    mapMask: maskType[][];
    tileSize?: number;
    wallHeight?: number;
    wallColor: Color;
    floorColor: Color;
}

export default class GeneratedScene extends Scene {
    private tileSize: number;
    private wallHeight: number;
    private wallColor: Color;
    private floorColor: Color;
    private _level: number = 1;
    private _mapMask: maskType[][];

    constructor({
                    canvasController,
                    mapController,
                    mapMask,
                    tileSize,
                    wallHeight,
                    wallColor,
                    floorColor
                }: IMapGenerator) {
        super(canvasController);
        this.addMapController(mapController);
        this.tileSize = tileSize || 1;
        this.wallHeight = wallHeight || 1;
        this.wallColor = wallColor;
        this.floorColor = floorColor;
        this._mapMask = mapMask;
        this.generateMap(mapMask);
    }

    get mapMask(): maskType[][] {
        return this._mapMask;
    }

    get level(): number {
        return this._level;
    }

    public createWall(position: Vector3, color: Color, scale: Vector3) {
        let obj = new Model({
            position: position,
            rotation: Vector3.zero,
            scale: scale
        });
        obj.addModule(new RenderModule({
            mesh: cubeMesh,
            texture: new OneColorTexture(color)
        }))
        if (this.mapController != null) {
            obj.addModule(new DrawRectOnMap({
                mapController: this.mapController,
                size: Vector2.one
            }))
        }
        obj.addModule(new RectXZCollider({size: Vector2.one}));
        this.addModel(obj);
    }

    private generateMap(mapMask: maskType[][]) {
        //Create floor
        let floor = new Model({
            position: Vector3.zero,
            rotation: Vector3.zero,
            scale: new Vector3([this.tileSize * mapMask.length, 0.5, this.tileSize * mapMask[0].length])
        });
        floor.addModule(new RenderModule({
            mesh: cubeMesh,
            texture: new OneColorTexture(this.floorColor)
        }))
        this.addModel(floor);
        //Create cell
        let cell = new Model({
            position: Vector3.zero.add(new Vector3([0, this.wallHeight * 2, 0])),
            rotation: Vector3.zero,
            scale: new Vector3([this.tileSize * mapMask.length, 0.5, this.tileSize * mapMask[0].length])
        });
        cell.addModule(new RenderModule({
            mesh: cubeMesh,
            texture: new OneColorTexture(this.floorColor)
        }))
        this.addModel(cell);
        //Create boarder
        let borders = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
        ]

        borders.forEach((pos) => {
            this.createWall(
                new Vector3([this.tileSize * mapMask.length * pos[0], 0.5 + this.wallHeight / 2, this.tileSize * mapMask[0].length * pos[1]]),
                this.wallColor,
                new Vector3([pos[0] == 0 ? this.tileSize * mapMask.length : 0.5, this.wallHeight, pos[1] == 0 ? this.tileSize * mapMask[0].length : 0.5])
            )
        });
        let wallsTab: boolean[][] = [];
        let getWallTab = (x: number, y: number) => {
            if (wallsTab[x] == null || wallsTab[x][y] == null) return false;
            return wallsTab[x][y];
        }
        let setWallTab = (x: number, y: number, value: boolean) => {
            if (wallsTab[x] == null) wallsTab[x] = [];
            wallsTab[x][y] = value;
        }
        mapMask.forEach((row, x) => {
            row.forEach((mask, z) => {
                let center = new Vector3([(x - mapMask.length / 2 + 0.5) * this.tileSize * 2, 1.5, (z - mapMask[0].length / 2 + 0.5) * this.tileSize * 2]);
                if ((mask & 1) > 0 && !getWallTab(x - 0.5, z)) {
                    this.createWall(
                        new Vector3([center.x - this.tileSize, center.y, center.z]),
                        this.wallColor,
                        new Vector3([0.5, this.wallHeight, this.tileSize + 0.5])
                    )
                    setWallTab(x - 0.5, z, true)
                }
                if ((mask & 2) > 0 && !getWallTab(x, z + 0.5)) {
                    this.createWall(
                        new Vector3([center.x, center.y, center.z + this.tileSize]),
                        this.wallColor,
                        new Vector3([this.tileSize + 0.5, this.wallHeight, 0.5])
                    )
                    setWallTab(x, z + 0.5, true)
                }
                if ((mask & 4) > 0 && !getWallTab(x + 0.5, z)) {
                    this.createWall(
                        new Vector3([center.x + this.tileSize, center.y, center.z]),
                        this.wallColor,
                        new Vector3([0.5, this.wallHeight, this.tileSize + 0.5])
                    )
                    setWallTab(x + 0.5, z, true)
                }
                if ((mask & 8) > 0 && !getWallTab(x, z - 0.5)) {
                    this.createWall(
                        new Vector3([center.x, center.y, center.z - this.tileSize]),
                        this.wallColor,
                        new Vector3([this.tileSize + 0.5, this.wallHeight, 0.5])
                    )
                    setWallTab(x, z - 0.5, true)
                }
            })
        })
        let pointGenerator = new GeneratingPointsModule();
        pointGenerator.generatePoints(
            mapMask, this.tileSize, this, this.mapController, 6
        );
    }

    getPositionOnBoard(pos: Vector2) {
        let x = pos.x / (this.tileSize * 2) + this._mapMask.length / 2 - 0.5;
        let y = pos.y / (this.tileSize * 2) + this._mapMask[0].length / 2 - 0.5;
        return new Vector2([x, y]);
    }

    getBoardToPosition(pos: Vector2) {
        let x = (pos.x - this.mapMask.length / 2 + 0.5) * this.tileSize * 2;
        let y = (pos.y - this.mapMask[0].length / 2 + 0.5) * this.tileSize * 2
        return new Vector2([x, y]);
    }

    winLevel() {
        alert("WIN");
    }

    loseLevel() {
        Game.instance.lose();
    }
}
