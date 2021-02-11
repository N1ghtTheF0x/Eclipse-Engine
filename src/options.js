"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EOptions = void 0;
const fs = require("fs");
const path = require("path");
const utils_1 = require("./utils");
const utils = new utils_1.EUtils("options.ts");
class EOptions {
    constructor(resourcesPath) {
        this.OPTIONS_PATH_FILE = path.resolve(resourcesPath, "options.json");
    }
    /**
     * Returns `true` if the Option File exists
     * @returns {boolean}
     */
    HasOptionFile() {
        if (fs.existsSync(this.OPTIONS_PATH_FILE)) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Returns the Option File as Object
     * @returns {{}}
     */
    GetOptionFile() {
        if (this.HasOptionFile()) {
            return JSON.parse(fs.readFileSync(this.OPTIONS_PATH_FILE, { encoding: "utf-8" }));
        }
        else {
            utils.print("warn", "Could not get Option File - File does not exist!");
            return {};
        }
    }
    /**
     * Creates a new Option File
     */
    CreateOptionFile() {
        if (!this.HasOptionFile()) {
            fs.writeFileSync(this.OPTIONS_PATH_FILE, JSON.stringify({}), { encoding: "utf-8" });
            return true;
        }
        else {
            utils.print("warn", "Could not create Option File - File already exists!");
            return false;
        }
    }
    /**
     * Updates the Option File
     * @param {{}} newOption
     */
    UpdateOptionFile(newOption) {
        const oldOption = this.GetOptionFile();
        const constructedOption = Object.assign(Object.assign({}, oldOption), newOption);
        fs.writeFileSync(this.OPTIONS_PATH_FILE, JSON.stringify(constructedOption), { encoding: "utf-8" });
    }
}
exports.EOptions = EOptions;
