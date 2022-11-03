import Scene from "../logic/Scene";
import CanvasController from "../logic/CanvasController";
import Model from "../logic/Model";
import Vector3 from "../math/Vector3";
import RenderModule from "../logic/modules/RenderModule";
import {cubeMesh} from "../logic/BasicFigures";
import OneColorTexture from "../logic/Textures/OneColorTexture";
import Color from "../math/Color";

type maskType = number; // 1 - up, 2 - right, 4 - down, 8 - left

export interface IMapGenerator {
    canvasController: CanvasController,
    mapMask: maskType[][];
    tileSize?: number;
    wallHeight?: number;
}

export default class GeneratedScene extends Scene {
    private tileSize: number;
    private wallHeight: number;

    constructor({canvasController, mapMask, tileSize, wallHeight}: IMapGenerator) {
        super(canvasController);
        this.tileSize = tileSize || 1;
        this.wallHeight = wallHeight || 1;
        this.generateMap(mapMask);
    }

    private createWall(position: Vector3, color: Color, scale: Vector3) {
        let obj = new Model({
            position: position,
            rotation: Vector3.zero,
            scale: scale
        });
        obj.addModule(new RenderModule({
            mesh: cubeMesh,
            texture: new OneColorTexture(color)
        }))
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
            texture: new OneColorTexture(Color.randomColor())
        }))
        this.addModel(floor);

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
                Color.randomColor(),
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
                let center = new Vector3([(x - mapMask.length / 2 + 0.5) * this.tileSize * 2, 1, (z - mapMask[0].length / 2 + 0.5) * this.tileSize * 2]);
                this.createWall(
                    center,
                    Color.randomColor(),
                    new Vector3([1, 1, 1])
                )
                if ((mask & 1) > 0 && !getWallTab(x - 0.5, z)) {
                    this.createWall(
                        new Vector3([center.x - this.tileSize + 0.5, center.y, center.z]),
                        Color.randomColor(),
                        new Vector3([0.5, this.wallHeight, this.tileSize])
                    )
                    setWallTab(x - 0.5, z, true)
                }
                if ((mask & 2) > 0 && !getWallTab(x, z + 0.5)) {
                    this.createWall(
                        new Vector3([center.x, center.y, center.z + this.tileSize + 0.5]),
                        Color.randomColor(),
                        new Vector3([this.tileSize, this.wallHeight, 0.5])
                    )
                    setWallTab(x, z + 0.5, true)
                }
                if ((mask & 4) > 0 && !getWallTab(x + 0.5, z)) {
                    this.createWall(
                        new Vector3([center.x + this.tileSize - 0.5, center.y, center.z]),
                        Color.randomColor(),
                        new Vector3([0.5, this.wallHeight, this.tileSize])
                    )
                    setWallTab(x + 0.5, z, true)
                }
                if ((mask & 8) > 0 && !getWallTab(x, z - 0.5)) {
                    this.createWall(
                        new Vector3([center.x, center.y, center.z - this.tileSize - 0.5]),
                        Color.randomColor(),
                        new Vector3([this.tileSize, this.wallHeight, 0.5])
                    )
                    setWallTab(x, z - 0.5, true)
                }
            })
        })


    }
}
