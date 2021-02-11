"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDebug = void 0;
class EDebug {
    constructor() {
        /**
         * Returns `true` if debug is on
         */
        this.on = false;
        /**
         * Draws the Hitboxes of `EObjects`
         */
        this.drawhitbox = false;
        /**
         * See Stats like FPS, last key pressed, etc.
         */
        this.statsondisplay = false;
        /**
         * Returns `true` if the developer tools by chrome is on
         */
        this.isdevconon = false;
    }
    /**
     * Displays Input Debug Stuff
     */
    LastPressed(Game) {
        if (Game.DEBUG.statsondisplay) {
            if (document.getElementById("debugtag")) {
                document.getElementById("debugtag").style.display = "inherit";
                const input = Game.input;
                if (document.getElementById("pressed")) {
                    document.getElementById("pressed").innerText = input.keyboard.lastKey;
                }
                if (document.getElementById("cursorx")) {
                    document.getElementById("cursorx").innerText = String(input.cursor.x);
                }
                if (document.getElementById("cursory")) {
                    document.getElementById("cursory").innerText = String(input.cursor.y);
                }
                if (document.getElementById("cpressed")) {
                    document.getElementById("cpressed").innerText = String(input.cursor.ButtonIndex);
                }
                if (document.getElementById("screensize")) {
                    const resolution = Game.render.GetResolution();
                    document.getElementById("screensize").innerText = resolution.width + "x" + resolution.height;
                }
            }
        }
        else {
            if (document.getElementById("debugtag")) {
                document.getElementById("debugtag").style.display = "none";
            }
        }
    }
    /**
     * Updates Player related Debug Stuff
     */
    PlayerUpdate(player) {
        if (document.getElementById("pxsp")) {
            document.getElementById("pxsp").innerText = String(player.xsp);
        }
        if (document.getElementById("pysp")) {
            document.getElementById("pysp").innerText = String(player.ysp);
        }
        if (document.getElementById("facing")) {
            document.getElementById("facing").innerText = player.facing;
        }
        if (document.getElementById("ishit")) {
            document.getElementById("ishit").innerText = player.hit + "";
        }
        if (document.getElementById("px")) {
            document.getElementById("px").innerText = player.x + "";
        }
        if (document.getElementById("py")) {
            document.getElementById("py").innerText = player.y + "";
        }
        if (document.getElementById("protation")) {
            document.getElementById("protation").innerText = player.rotation + "";
        }
        if (document.getElementById("isground")) {
            document.getElementById("isground").innerText = player.ground + "";
        }
        if (document.getElementById("isjumping")) {
            document.getElementById("isjumping").innerText = player.jumping + "";
        }
    }
}
exports.EDebug = EDebug;
