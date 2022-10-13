import Module from "../Module";
import CanvasController from "../CanvasController";
import {mat4} from "gl-matrix";
import Scene from "../Scene";

export default class RenderModule extends Module {
    private vertices: number[];
    private colors: number[];
    private indices: number[];
    private Pmatrix: WebGLUniformLocation | null = null;
    private Vmatrix: WebGLUniformLocation | null = null;
    private Mmatrix: WebGLUniformLocation | null = null;
    private index_buffer: WebGLBuffer | null = null;

    constructor() {
        super(100);
        this.vertices = [
            -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
            -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
            -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1,
            1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
            -1, -1, -1, -1, -1, 1, 1, -1, 1, 1, -1, -1,
            -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
        ];

        this.colors = [
            5, 3, 7, 5, 3, 7, 5, 3, 7, 5, 3, 7,
            1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3,
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
        ];

        this.indices = [
            0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
        ];
        this.init();

    }

    init() {
        let gl = CanvasController.instance?.canvasCtx;
        if (!gl) return;

        // Create and store data into vertex buffer
        var vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        // Create and store data into color buffer
        var color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

        // Create and store data into index buffer
        this.index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        /*=================== Shaders =========================*/

        var vertCode = 'attribute vec3 position;' +
            'uniform mat4 Pmatrix;' +
            'uniform mat4 Vmatrix;' +
            'uniform mat4 Mmatrix;' +
            'attribute vec3 color;' +//the color of the point
            'varying vec3 vColor;' +

            'void main(void) { ' +//pre-built function
            'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);' +
            'vColor = color;' +
            '}';

        var fragCode = 'precision mediump float;' +
            'varying vec3 vColor;' +
            'void main(void) {' +
            'gl_FragColor = vec4(vColor, 1.);' +
            '}';

        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertShader) return;
        gl.shaderSource(vertShader, vertCode);
        gl.compileShader(vertShader);

        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragShader) return;
        gl.shaderSource(fragShader, fragCode);
        gl.compileShader(fragShader);

        var shaderProgram = gl.createProgram();
        if (!shaderProgram) return;
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);

        this.Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
        this.Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
        this.Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");

        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        var position = gl.getAttribLocation(shaderProgram, "position");
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

        // Position
        gl.enableVertexAttribArray(position);
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        var color = gl.getAttribLocation(shaderProgram, "color");
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);

        // Color
        gl.enableVertexAttribArray(color);
        gl.useProgram(shaderProgram);
    }

    bind() {

    }

    update(_: number): void {
        let owner = this.modelOwner;
        if (!owner) return;
        let canvas = CanvasController.instance;
        if (!canvas) return;
        let gl = canvas.canvasCtx;
        const modelMatrix = mat4.create();
        mat4.fromRotationTranslationScale(modelMatrix, owner.rotation, owner.position, owner.scale);
        let cam = Scene.instance.mainCamera;
        if (!cam) return;
        let m = mat4.create();
        mat4.invert(m, cam.getViewMatrix());



        gl.uniformMatrix4fv(this.Pmatrix, false, cam.perspective);
        gl.uniformMatrix4fv(this.Vmatrix, false, m);
        gl.uniformMatrix4fv(this.Mmatrix, false, modelMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    }

}
