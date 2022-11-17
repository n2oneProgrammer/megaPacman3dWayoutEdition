/** @type {import('vite').UserConfig} */
import {defineConfig} from "vite";

export default defineConfig(({command, mode, ssrBuild}) => {
    if (command === "build") {
        return {
            base: "/megaPacman3dWayoutEdition/",
            build: {
                target: 'esnext'
            }
        };
    }
    return {};
});
