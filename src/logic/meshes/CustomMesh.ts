import Mesh from "./Mesh";
import {vec3} from "gl-matrix";

export default class CustomMesh extends Mesh {
    constructor() {
        super({
            vertices: [],
            triangles: [],
            normal: []
        });
    }

    public addVertex(vertex: vec3) {
        this.vertices.push(...vertex)
    }

    public addTriangle(triangle: [number, number, number]) {
        this.triangles.push(...triangle)
    }

    addNormal(normal: vec3) {
        this.normals.push(...normal);
    }
}
