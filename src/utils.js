"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EUtils = void 0;
const path = require("path");
const fs = require("fs");
const console = require("console");
const logfile_path = (typeof process.resourcesPath === "string") ? path.resolve(process.resourcesPath, "latest.log") : "./latest.log";
const latestlogfile = fs.createWriteStream(logfile_path);
const fileconsole = new console.Console(latestlogfile, latestlogfile);
const Console = new console.Console(process.stdout, process.stderr);
class EUtils {
    constructor(filename = typeof require.main === "object" ? require.main.filename : "unknown") {
        this.filename = filename;
    }
    /**
     * A better and pretty print function. It shows when the print function got executed with an type like WARN, DEBUG, INFO, ERROR and which file got affected
     * @param {PrintType} type - The type of the log message.
     * @param {string} message - What's the message to print to the Console?
     * @param {boolean} file - Should we also log to the log file?
     */
    print(type, message, file = true) {
        const Month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date();
        const clock = d.toLocaleTimeString();
        const TYPE = type.toUpperCase();
        const time = "[" + Month[d.getMonth()] + " " + d.getDate() + " " + clock + "]";
        const result = time + " {" + this.filename + "} " + TYPE + " - " + message;
        if (Console[type.toLowerCase()]) {
            Console[type.toLowerCase()](result);
            if (file) {
                fileconsole[type.toLowerCase()](result);
            }
        }
        else {
            Console["info"](result);
            if (file) {
                fileconsole["info"](result);
            }
        }
    }
    /**
     * Fast way to print debug stuff
     * @param {string} message
     */
    Dprint(message) {
        this.print("info", message);
    }
    /**
     * A Random Number Generator with Range
     * @param {number} min - the minimum possible number
     * @param {number} max - the max possible number
     */
    RandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    /**
     * A RGB function, what's more to say?
     * @param {number} red - RED 0...255
     * @param {number} green - GREEEN 0...255
     * @param {number} blue - BLUE 0...255
     */
    RGB(red, green, blue) {
        return "rgb(" + red + "," + green + "," + blue + ")";
    }
    /**
     * Same as RGB but with Alpha
     * @param {number} red - RED 0...255
     * @param {number} green - GREEN 0...255
     * @param {number} blue - BLUE 0...255
     * @param {number} alpha - ALPHA 0...1 | decimals values are possible, just between 0 and 1
     */
    RGBA(red, green, blue, alpha) {
        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }
    /**
     * Return a boolean if the number is negative
     * @param {number} num - Is this number negative?
     */
    IsNumberNegative(num) {
        const sign = Math.sign;
        if (sign(num) === 1) {
            return false;
        }
        else if (sign(num) === -1) {
            return true;
        }
        else if (sign(0) === 0) {
            return false;
        }
        return false;
    }
    /**
     * Returns the name of the script executed
     */
    GetScriptName() {
        return path.basename(__filename);
    }
}
exports.EUtils = EUtils;
