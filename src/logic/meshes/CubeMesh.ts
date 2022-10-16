import Mesh from "./Mesh";
import {vec3} from "gl-matrix";

export default class CubeMesh extends Mesh {
    constructor() {
        let ver: vec3[] = [
            [1, 1, 1],
            [1, 1, -1],
            [-1, 1, -1],
            [-1, 1, 1],
            [1, -1, 1],
            [1, -1, -1],
            [-1, -1, -1],
            [-1, -1, 1],
        ]
        let triangles: [number, number, number][] = [
            [0, 1, 2],
            [0, 3, 2],
            [1, 5, 6],
            [1, 2, 6],
            [3, 2, 6],
            [3, 7, 6],
            [4, 0, 1],
            [4, 5, 1],
            [4, 0, 3],
            [4, 7, 3],
            [4, 5, 6],
            [4, 7, 6]
        ];
        super({
            vertices: ver,
            triangles: triangles
        });
    }
}
