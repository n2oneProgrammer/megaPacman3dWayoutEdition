import Mesh from "../meshes/Mesh";
import CustomMesh from "../meshes/CustomMesh";
import {vec3} from "gl-matrix";

const OBJLoader = {
    parse(source: string): Mesh {
        let mesh = new CustomMesh();
        let normals: vec3[] = [];
        let vertices: vec3[] = [];
        const keywords: { [key: string]: (a: string[]) => void } = {
            v(parts) {
                vertices.push(parts.map(parseFloat) as vec3)
            },
            vn(parts) {
                normals.push(parts.map(parseFloat) as vec3)
            },
            vt(_) {
                //TODO: NOT IMPLEMENTED

            },
            f(parts) {
                const numTriangles = parts.length - 2;
                for (let tri = 0; tri < numTriangles; ++tri) {
                    let v = [parts[0], parts[tri + 1], parts[tri + 2]].map((e) => {
                        let ptn = e.split("/");
                        return vertices[parseInt(ptn[0]) - 1];
                    });
                    mesh.addVertex(v[0]);
                    mesh.addVertex(v[1]);
                    mesh.addVertex(v[2]);
                    let i = mesh.triangles[mesh.triangles.length - 1] || -1;
                    mesh.addTriangle([i + 1, i + 2, i + 3]);
                    mesh.addNormal([parts[0], parts[tri + 1], parts[tri + 2]].map((e) => {
                        let ptn = e.split("/");
                        if (ptn[2] == undefined) {
                            return [0, 0, 0];
                        }
                        return normals[parseInt(ptn[2]) - 1];
                    }).reduce((a: number[], b) => [...a, ...b], []) as [number, number, number]);
                }
            },
        };

        const keywordRE = /(\w*)(?: )*(.*)/;
        const lines = source.split('\n');
        for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
                continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
                continue;
            }
            const [, keyword,] = m;
            const parts = line.split(/\s+/).slice(1);
            const handler = keywords[keyword];
            if (!handler) {
                console.warn('unhandled keyword:', keyword);  // eslint-disable-line no-console
                continue;
            }
            handler(parts);
        }
        return mesh;
    }
}
export default OBJLoader;
