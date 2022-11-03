import CanvasController from "../CanvasController";
import Vector2 from "../../math/Vector2";
import {EventType, MouseButton} from "../enum/EventType";

export default class InputService {
    private static _instance: InputService | null = null;
    // @ts-ignore
    private readonly canvas: HTMLCanvasElement;
    private mousePosition: Vector2 = new Vector2([0, 0]);
    private mouseMoment: Vector2 = new Vector2([0, 0]);
    private mousePressButton: Array<MouseButton> = [];
    private keyPressButton: Array<string> = [];
    private registeredFunction: Map<EventType, Array<(e: Event) => void>> = new Map();

    constructor() {
        if (InputService._instance != null) {
            return InputService._instance;
        }
        let canvas = CanvasController.instance?.canvasDOM;
        if (canvas == null) {
            throw new Error("Canvas not found");
        }
        this.canvas = canvas;
        this.canvas.addEventListener("mousemove", this.mouseover.bind(this));
        this.canvas.addEventListener("mousedown", this.mousedown.bind(this));
        this.canvas.addEventListener("mouseup", this.mouseup.bind(this));
        window.addEventListener("keydown", this.keydown.bind(this));
        window.addEventListener("keyup", this.keyup.bind(this));
        InputService._instance = this;
    }

    private runEvent(type: EventType, event: Event) {
        let events = this.registeredFunction.get(type) || [];
        events.forEach(f => f(event));
    }

    resetMovement() {
        this.mouseMoment = new Vector2([0, 0]);
    }

    private mouseover(event: MouseEvent) {
        let x = event.x - this.canvas.getBoundingClientRect().x;
        let y = event.y - this.canvas.getBoundingClientRect().y;
        this.mousePosition = new Vector2([x, y]);
        this.mouseMoment = new Vector2([event.movementX, event.movementY]);
        this.runEvent(EventType.MOUSE_MOVE, event);
    }

    private mousedown(event: MouseEvent) {
        this.mousePressButton.push(event.button);
        this.runEvent(EventType.MOUSE_CLICK, event);
    }

    private mouseup(event: MouseEvent) {
        this.mousePressButton = this.mousePressButton.filter((d) => d != event.button);
        this.runEvent(EventType.MOUSE_CLICK, event);
    }

    private keydown(event: KeyboardEvent) {
        if (!this.keyPressButton.some((k) => k === event.key))
            this.keyPressButton.push(event.key);
        this.runEvent(EventType.KEYBOARD_CLICK, event);
    }

    private keyup(event: KeyboardEvent) {
        this.keyPressButton = this.keyPressButton.filter((d) => d != event.key);
        this.runEvent(EventType.KEYBOARD_CLICK, event);
    }

    public registerEvent(type: EventType, callback: (e: Event) => void): number {
        if (!this.registeredFunction.has(type)) {
            this.registeredFunction.set(type, []);
        }
        let t = this.registeredFunction.get(type);
        if (t != null) {
            let id = t.length;
            t.push(callback);
            this.registeredFunction.set(type, t);
            return id;
        }
        return -1;
    }

    public unRegisterEvent(type: EventType, callback_id: number) {
        let t = this.registeredFunction.get(type);
        if (t != null) {
            t = t.filter((_, i) => i !== callback_id);
            this.registeredFunction.set(type, t);
        }
    }

    public getMouseMoment(): Vector2 {
        return this.mouseMoment;
    }

    public getMousePosition(): Vector2 {
        return this.mousePosition;
    }

    public getKeyPress(): string[] {
        return this.keyPressButton;
    }

    public isMouseButtonClick(button: MouseButton) {
        return this.mousePressButton.some((m) => m != button);
    }

    public isKeyButtonPress(button: string) {
        return this.keyPressButton.some((m) => m === button);
    }

    public mouseLock() {
        this.canvas.requestPointerLock();
    }

    public mouseUnlock() {
        document.exitPointerLock();
    }

    public static get instance(): InputService {
        if (this._instance == null) {
            this._instance = new InputService();
        }
        return this._instance;
    }
}
