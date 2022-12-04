import InfoCanvasController from "../logic/InfoCanvasController";
import Vector2 from "../math/Vector2";
import Color from "../math/Color";

let levelTable = [1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8];
let images: HTMLImageElement[] = [];
let loadingImage = 8;
for (let i = 1; i <= 8; i++) {
    let image = new Image();
    image.src = "fruits/" + i + ".png";
    images.push(image);
    image.addEventListener("load", () => {
        loadingImage--;
    })
}
export default function (infoCanvas: InfoCanvasController, position: Vector2, level: number) {
    if (loadingImage > 0) return;
    infoCanvas.drawText("Level: ", position, 20, Color.WHITE);

    let table;
    if (level < 8) {
        table = levelTable.slice(0, level);
    } else if (level < 19) {
        table = levelTable.slice(level - 7, level);
    } else {
        table = levelTable.slice(12, 19);
    }
    for (let i = 0; i < table.length; i++) {
        infoCanvas.drawImage(images[table[i] - 1], position.add(new Vector2([70 + 30 * i, -5])), 0, new Vector2([20, 20]));
    }

}
