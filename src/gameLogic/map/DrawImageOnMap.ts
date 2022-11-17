import Module from "../../logic/Module";
import MapController from "../../logic/MapController";
import Vector2 from "../../math/Vector2";

export interface IDrawImageOnMap {
    mapController: MapController,
    imageSrc: string,
    canRotation?: boolean,
    size: Vector2
}

export default class DrawImageOnMap extends Module {
    private mapController: MapController;
    private canRotation: boolean;
    private image: HTMLImageElement;
    private isImageLoaded: boolean = false;
    private size: Vector2;

    constructor({mapController, imageSrc, canRotation, size}: IDrawImageOnMap) {
        super();
        this.size = size;
        this.mapController = mapController;
        this.canRotation = canRotation || false;
        this.image = new Image();
        this.image.src = imageSrc;
        this.image.addEventListener("load", () => {
            this.isImageLoaded = true
        });
    }

    update(_: number): void {
        if (this.modelOwner == null || !this.isImageLoaded) return;
        let posXZ = this.modelOwner.position.toVec2XZ();
        this.mapController.drawImage(this.image, posXZ, -(this.canRotation ? this.modelOwner.rotation.y + Math.PI : 0), this.size);
    }

}
