import {vec3} from "gl-matrix";

export interface IMesh {
    vertices: vec3[];
    triangles: [number, number, number][];
}

export default abstract class Mesh {
    private readonly _vertices: number[];
    private readonly _triangles: number[];

    protected constructor(params?: IMesh) {
        if (!params) {
            this._vertices = [];
            this._triangles = [];
        } else {
            this._vertices = params.vertices.reduce((a: number[], b: vec3) => [...a, ...b], []);
            this._triangles = params.triangles.reduce((a: number[], b) => [...a, ...b], []);
            console.log(this);
        }
    }


    get vertices(): number[] {
        return this._vertices;
    }

    get triangles(): number[] {
        return this._triangles;
    }
}
