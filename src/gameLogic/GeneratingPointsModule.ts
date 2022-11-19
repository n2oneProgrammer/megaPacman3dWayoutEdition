import {maskType} from "./GeneratedScene";
import Scene from "../logic/Scene";
import Vector3 from "../math/Vector3";
import PointModel from "./Models/PointModel";
import MapController from "../logic/MapController";

export default class GeneratingPointsModule {
    generatePoints(mapMask: maskType[][], tileSize: number, scene: Scene, mapController: MapController | null) {
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
                let pos = new Vector3([(x - mapMask.length / 2 + 0.5) * tileSize * 2, 2, (z - mapMask[0].length / 2 + 0.5) * tileSize * 2]);

                if ((mask & 1) == 0 && !getWallTab(x - 0.5, z) && x - 0.5 > 0) {
                    scene.addModel(new PointModel({
                        position: pos.add(new Vector3([-tileSize, 0, 0])),
                        mapController: mapController
                    }))
                    setWallTab(x - 0.5, z, true)
                }
                if ((mask & 2) == 0 && !getWallTab(x, z + 0.5)  && z + 0.5 < mapMask[0].length-1) {
                    scene.addModel(new PointModel({
                        position: pos.add(new Vector3([0, 0, tileSize])),
                        mapController: mapController
                    }))
                    setWallTab(x, z + 0.5, true)
                }
                if ((mask & 4) == 0 && !getWallTab(x + 0.5, z) && x + 0.5 < mapMask.length-1) {
                    scene.addModel(new PointModel({
                        position: pos.add(new Vector3([tileSize, 0, 0])),
                        mapController: mapController
                    }))
                    setWallTab(x + 0.5, z, true)
                }
                if ((mask & 8) == 0 && !getWallTab(x, z - 0.5) && z - 0.5 > 0) {
                    scene.addModel(new PointModel({
                        position: pos.add(new Vector3([0, 0, -tileSize])),
                        mapController: mapController
                    }))
                    setWallTab(x, z - 0.5, true)
                }
            })
        })
    }
}
