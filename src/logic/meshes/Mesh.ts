import {vec3} from "gl-matrix";

export interface IMesh {
    vertices?: vec3[];
    triangles?: [number, number, number][];
    normal?: vec3[];
}

export default abstract class Mesh {
    private readonly _vertices: number[];
    private readonly _triangles: number[];
    private readonly _normals: number[];

    protected constructor(params?: IMesh) {
        this._vertices = params?.vertices?.reduce((a: number[], b) => [...a, ...b], []) || [];
        this._triangles = params?.triangles?.reduce((a: number[], b) => [...a, ...b], []) || [];
        this._normals = params?.normal?.reduce((a: number[], b) => [...a, ...b], []) || [];
    }

    get vertices(): number[] {
        return this._vertices;
    }

    get triangles(): number[] {
        return this._triangles;
    }

    get normals(): number[] {
        return this._normals;
    }
}
