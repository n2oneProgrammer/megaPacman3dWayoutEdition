import Vector3 from "./Vector3.js";
import {Matrix3x3} from "./Matrix.js";
import {quat} from "gl-matrix";

export interface IQuaternion {
    x: number,
    y: number,
    z: number,
    w: number
}

export default class Quaternion {
    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;

    constructor(data: IQuaternion | [number, number, number, number]) {
        if (data instanceof Array) {
            this._x = data[0];
            this._y = data[1];
            this._z = data[2];
            this._w = data[3];
        } else {
            this._x = data.x;
            this._y = data.y;
            this._z = data.z;
            this._w = data.w;
        }
    }

    add(q: Quaternion): Quaternion {
        return new Quaternion([this._x + q._x, this._y + q._y, this._z + q._z, this._w + q._w])
    }

    mul(v: Vector3 | Quaternion): Vector3 | Quaternion {
        if (v instanceof Vector3) {
            const ix = this.w * v.x + this.y * v.z - this.z * v.y;
            const iy = this.w * v.y + this.z * v.x - this.x * v.z;
            const iz = this.w * v.z + this.x * v.y - this.y * v.x;
            const iw = -this.x * v.x - this.y * v.y - this.z * v.z;

            return new Vector3([
                ix * this.w + iw * -this.x + iy * -this.z - iz * -this.y,
                iy * this.w + iw * -this.y + iz * -this.x - ix * -this.z,
                iz * this.w + iw * -this.z + ix * -this.y - iy * -this.x]
            );
        } else {
            return new Quaternion(
                [this.x * v.w + this.w * v.x + this.y * v.z - this.z * v.y,
                    this.y * v.w + this.w * v.y + this.z * v.x - this.x * v.z,
                    this.z * v.w + this.w * v.z + this.x * v.y - this.y * v.x,
                    this.w * v.w - this.x * v.x - this.y * v.y - this.z * v.z]
            );
        }
    }

    negative() {
        return new Quaternion([-this._x, -this._y, -this._z, this._w]);
    }

    //getters and setters
    get w(): number {
        return this._w;
    }

    get z(): number {
        return this._z;
    }

    get y(): number {
        return this._y;
    }

    get x(): number {
        return this._x;
    }

    // static
    static zero = new Quaternion([0, 0, 0, 1]);

    static setFromEuler(vector: Vector3) {
        const c1 = Math.cos(vector.x / 2);
        const c2 = Math.cos(vector.y / 2);
        const c3 = Math.cos(vector.z / 2);

        const s1 = Math.sin(vector.x / 2);
        const s2 = Math.sin(vector.y / 2);
        const s3 = Math.sin(vector.z / 2);

        return new Quaternion([
                s1 * c2 * c3 + c1 * s2 * s3,
                c1 * s2 * c3 - s1 * c2 * s3,
                c1 * c2 * s3 + s1 * s2 * c3,
                c1 * c2 * c3 - s1 * s2 * s3
            ]
        );
    }

    static lookAt(source: Vector3, dest: Vector3) {
        let forward = dest.sub(source).normalize();
        let right = Vector3.up.cross(forward).normalize();
        let newUp = forward.cross(right);

        return new Matrix3x3([
            [right.x, newUp.x, forward.x],
            [right.y, newUp.y, forward.y],
            [right.z, newUp.z, forward.z]
        ]);
    }

    static getQuaternionFromMatrix(m: Matrix3x3): Quaternion {
        let w = Math.sqrt(Math.max(0, 1 + m.get(0, 0) + m.get(1, 1) + m.get(2, 2))) / 2;
        let x = Math.sqrt(Math.max(0, 1 + m.get(0, 0) - m.get(1, 1) - m.get(2, 2))) / 2;
        let y = Math.sqrt(Math.max(0, 1 - m.get(0, 0) + m.get(1, 1) - m.get(2, 2))) / 2;
        let z = Math.sqrt(Math.max(0, 1 - m.get(0, 0) - m.get(1, 1) + m.get(2, 2))) / 2;
        x *= Math.sign(x * (m.get(2, 1) - m.get(1, 2)));
        y *= Math.sign(y * (m.get(0, 2) - m.get(2, 0)));
        z *= Math.sign(z * (m.get(1, 0) - m.get(0, 1)));
        return new Quaternion([x, y, z, w]);
    }

    static getSqrt(v: number): number {
        if (v == 0 || v == 1) {
            return v;
        }
        if (v == -1) {
            return -1;
        }
        let precision = 0.000001;
        let result = v;
        while ((result - v / result) > precision) {
            result = (result - v / result) / 2;
        }
        return result;
    }

    toArray(): quat {
        return [this._x, this._y, this._z, this._w];
    }
}
