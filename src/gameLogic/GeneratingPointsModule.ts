import {maskType} from "./GeneratedScene";
import Scene from "../logic/Scene";
import Vector3 from "../math/Vector3";
import PointModel from "./Models/PointModel";
import MapController from "../logic/MapController";
import FoodModel from "./Models/FoodModel";
import PointManager from "./PointManager";

let noPointsFields = [
    [2, 4],
    [2, 5],
    [2, 6],
    [2, 7],
]
export default class GeneratingPointsModule {
    generatePoints(mapMask: maskType[][], tileSize: number, scene: Scene, mapController: MapController | null, countFoods: number) {
        let wallsTab: boolean[][] = [];
        let getWallTab = (x: number, y: number) => {
            if (wallsTab[x] == null || wallsTab[x][y] == null) return false;
            return wallsTab[x][y];
        }
        let setWallTab = (x: number, y: number, value: boolean) => {
            if (wallsTab[x] == null) wallsTab[x] = [];
            wallsTab[x][y] = value;
        }
        setWallTab(1.5, 5, true);
        setWallTab(1.5, 6, true);
        mapMask.forEach((row, x) => {
            row.forEach((mask, z) => {
                if (noPointsFields.find(e => e[0] === x && e[1] === z)) {
                    return;
                }
                let pos = new Vector3([(x - mapMask.length / 2 + 0.5) * tileSize * 2, 2, (z - mapMask[0].length / 2 + 0.5) * tileSize * 2]);
                scene.addModel(new PointModel({
                    position: pos,
                    mapController: mapController
                }))
                if ((mask & 1) == 0 && !getWallTab(x - 0.5, z) && x - 0.5 > 0) {
                    scene.addModel(new PointModel({
                        position: pos.add(new Vector3([-tileSize, 0, 0])),
                        mapController: mapController
                    }))
                    setWallTab(x - 0.5, z, true)
                }
                if ((mask & 2) == 0 && !getWallTab(x, z + 0.5) && z + 0.5 < mapMask[0].length - 1) {
                    scene.addModel(new PointModel({
                        position: pos.add(new Vector3([0, 0, tileSize])),
                        mapController: mapController
                    }))
                    setWallTab(x, z + 0.5, true)
                }
                if ((mask & 4) == 0 && !getWallTab(x + 0.5, z) && x + 0.5 < mapMask.length - 1) {
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
        let foods: FoodModel[] = [];
        for (let i = 0; i < countFoods; i++) {
            let model = scene.models[Math.floor(Math.random() * scene.models.length)];
            if (!(model instanceof PointModel) || foods.find(f => model.position.sub(f.position).lengthSquare() < 90) != null) {
                i--;
                continue;
            }
            let position = model.position;
            scene.removeModel(model);
            PointManager.instance.decreasePoints();
            let food = new FoodModel({
                position: position,
                mapController: scene.mapController
            });
            foods.push(food)
            scene.addModel(food)
        }

    }
}
