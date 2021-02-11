"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EIOManager = void 0;
const utils_1 = require("./utils");
const fs = require("fs");
const path = require("path");
const utils = new utils_1.EUtils("io.ts");
class EIOManager {
    constructor() {
    }
    /**
     * Reads the file an returns it as an `Base64` string
     * @param {string} path - Path to the File
     * @returns {string}
     */
    ReadFileInBase64(path) {
        return fs.readFileSync(path, { encoding: "base64" });
    }
    /**
     * Loads an Image from path
     * @param {"png"|"jpeg"} type - The type of image
     * @param {string} path - Path to the Image
     * @returns {HTMLImageElement}
     */
    LoadImage(type, path) {
        const img = new Image();
        const src = "data:image/" + type + ";base64," + this.ReadFileInBase64(path);
        img.addEventListener("error", function (err) {
            utils.print("error", "Error at image from " + path + ":\n\n" + err);
        });
        img.src = src;
        return img;
    }
    /**
     * Loads an Image from path the old way
     * @param {string} path - Path to the Image
     * @returns {HTMLImageElement}
     */
    LoadImageOld(path) {
        const img = new Image();
        img.addEventListener("error", function (err) {
            utils.print("error", "Error at image from " + path + ":\n\n" + err);
        });
        img.src = path;
        return img;
    }
    PathResolve(...pathSegments) {
        const PATH = pathSegments.join(path.sep);
        return path.resolve(PATH);
    }
    FileExists(path) {
        return fs.existsSync(path);
    }
}
exports.EIOManager = EIOManager;
