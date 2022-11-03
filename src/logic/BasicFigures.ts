import OBJLoader from "./Loaders/OBJLoader";
import FileLoader from "./Loaders/FileLoader";

let cubeMesh = OBJLoader.parse(await FileLoader.load("resources/models/cube.obj"));
let ghostMesh = OBJLoader.parse(await FileLoader.load("resources/models/ghost.obj"));
export {cubeMesh, ghostMesh};
