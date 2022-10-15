import Module from "../Module";
import CanvasController from "../CanvasController";
import {mat4} from "gl-matrix";
import Scene from "../Scene";
import Mesh from "../meshes/Mesh";
import Texture from "../Textures/Texture";

export interface IRenderModule {
    mesh: Mesh;
    texture: Texture;
}

export default class RenderModule extends Module {
    private Pmatrix: WebGLUniformLocation | null = null;
    private Vmatrix: WebGLUniformLocation | null = null;
    private Mmatrix: WebGLUniformLocation | null = null;
    private index_buffer: WebGLBuffer | null = null;
    private shaderProgram: WebGLProgram | null = null;
    private vertex_buffer: WebGLBuffer | null = null;
    private color_buffer: WebGLBuffer | null = null;
    private mesh: Mesh;
    private texture: Texture;

    constructor({mesh, texture}: IRenderModule) {
        super(100);
        this.mesh = mesh;
        this.texture = texture;
        this.texture.calculatingColor(this.mesh.vertices);
        this.init();

    }

    init() {
        let gl = CanvasController.instance?.canvasCtx;
        if (!gl) return;

        // Create and store data into vertex buffer
        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.mesh.vertices), gl.STATIC_DRAW);

        // Create and store data into color buffer
        this.color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture.colorVertices), gl.STATIC_DRAW);

        // Create and store data into index buffer
        this.index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.mesh.triangles), gl.STATIC_DRAW);

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

        this.shaderProgram = gl.createProgram();
        if (!this.shaderProgram) return;
        gl.attachShader(this.shaderProgram, vertShader);
        gl.attachShader(this.shaderProgram, fragShader);
        gl.linkProgram(this.shaderProgram);
    }

    bind() {

    }

    update(_: number): void {
        let owner = this.modelOwner;
        if (!owner) return;
        let canvas = CanvasController.instance;
        if (!canvas) return;
        if (!this.shaderProgram) return;
        let gl = canvas.canvasCtx;
        const modelMatrix = mat4.create();
        mat4.fromRotationTranslationScale(modelMatrix, owner.rotation, owner.position, owner.scale);
        let cam = Scene.instance.mainCamera;
        if (!cam) return;
        let m = mat4.create();
        mat4.invert(m, cam.getViewMatrix());
        this.Pmatrix = gl.getUniformLocation(this.shaderProgram, "Pmatrix");
        this.Vmatrix = gl.getUniformLocation(this.shaderProgram, "Vmatrix");
        this.Mmatrix = gl.getUniformLocation(this.shaderProgram, "Mmatrix");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        var position = gl.getAttribLocation(this.shaderProgram, "position");
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

        // Position
        gl.enableVertexAttribArray(position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.color_buffer);
        var color = gl.getAttribLocation(this.shaderProgram, "color");
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);

        // Color
        gl.enableVertexAttribArray(color);
        gl.useProgram(this.shaderProgram);


        gl.uniformMatrix4fv(this.Pmatrix, false, cam.perspective);
        gl.uniformMatrix4fv(this.Vmatrix, false, m);
        gl.uniformMatrix4fv(this.Mmatrix, false, modelMatrix);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.drawElements(gl.TRIANGLES, this.mesh.triangles.length, gl.UNSIGNED_SHORT, 0);

    }

}
