"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EGame = void 0;
const utils_1 = require("./utils");
const screen_1 = require("./screen");
const electron = require("electron");
const audio_1 = require("./audio");
const debug_1 = require("./debug");
const discord_1 = require("./discord");
const io_1 = require("./io");
const objects_1 = require("./objects");
const render_1 = require("./render");
const fonts_1 = require("./fonts");
const input_1 = require("./input");
const utils = new utils_1.EUtils("game.ts");
const options = null;
class EHooks {
    constructor() {
        /**
         * Executes before clearing the scene
         * @type {function(EGame): void}
         */
        this.beforedrawclear = function (game) { };
        /**
         * Executes before drawing the scene (After Screen Clear)
         * @type {function(EGame): void}
         */
        this.beforedraw = function (game) { };
        /**
         * Executes after drawing the scene
         * @type {function(EGame): void}
         */
        this.afterdraw = function (game) { };
        /**
         * Executes before updating the scene
         * @type {function(EGame): void}
         */
        this.beforeupdate = function (game) { };
        /**
         * Executes after updating the scene
         * @type {function(EGame): void}
         */
        this.afterupdate = function (game) { };
    }
}
class EGame {
    /**
     * The Heart of Eclipse Engine! Contains everything you need
     * @param {{}} Options - The
     */
    constructor(WINDOW, Options) {
        this.window = WINDOW;
        /**
         * Frames per Second of this Instance
         */
        this.fps = 0;
        /**
         * A Collection of Hooks
         */
        this.hooks = new EHooks();
        /**
         * Currently viewing EScreen
         */
        this.current = null;
        /**
         * Previous EScreen
         */
        this.old = null;
        /**
         * `requestAnimationFrame` Interval
         */
        this.interval = 0;
        /**
         * The Render Instance of this Instance
         */
        this.render = null;
        /**
         * Game Options
         */
        this.options = Options;
        /**
         * Enable WebGL Render?
         */
        this.hardware = false;
        /**
         * Discord Client of this Instance
         * @type {EDiscord}
         */
        this.discordrpc = null;
        /**
         * All EScreens of this Instance. **THEY ARE IN THE PROPERTY `map`!!!!**
         */
        this.screenmanager = new screen_1.EScreens.EScreenManager();
        /**
         * Currently selected button
         */
        this.buttonIndex = 0;
        /**
         * Is this game packaged?
         */
        this.packaged = __dirname.includes("app.asar");
        /**
         * Check debugging stuff
         */
        this.DEBUG = new debug_1.EDebug();
        /**
         * E I/O Access
         */
        this.io = new io_1.EIOManager();
        /**
         * EDiscord Access
         */
        this.discord = new discord_1.EDiscordManager();
        /**
         * EObjects Access
         */
        this.eobjects = { CreateEObject: objects_1.EObjects.CreateEObject, CreateEObjectPlayer: objects_1.EObjects.CreateEObjectPlayer };
        /**
         * EAudioManager Access
         */
        this.eaudio = new audio_1.EAudios.EAudioManager();
        /**
         * Electron Access
         */
        this.dialog = electron.dialog;
        /**
         * Utilities Access
         */
        this.utils = utils_1.EUtils;
        /**
         * EFont Access
         */
        this.efont = new fonts_1.EFontManager();
        this.input = new input_1.EInput(this.window);
        this.eoptions = null;
    }
    /**
     * Updates the current `EScreen`
     * @param {Escreen.EScreen} newEScreen - The new `EScreen` Object
     */
    UpdateEScreen(newEScreen) {
        this.old = this.current;
        this.current = newEScreen;
        utils.print("info", "Updated Game Variables");
    }
    /**
     * Updates the current `ERender`
     * @param {ERender} Render - The new `ERender` Object
     */
    UpdateRender(Render) {
        this.render = Render;
        utils.print("info", "Updated Game Render");
    }
    /**
     * Updates the ID of the `requestAnimationFrame`
     * @param {number} interval
     */
    UpdateInterval(interval) {
        this.interval = interval;
    }
    /**
     * Update Options
     */
    UpdateOptions() {
        this.options = options.GetOptionFile();
    }
    /**
     * Updates the Discord Client
     * @param {EDiscord} Discord
     */
    UpdateDiscord(Discord) {
        this.discordrpc = Discord;
    }
    /**
     * Switch to a another EScreen
     * @param {string} id - The ID of the EScreen to switch
     * @param {boolean} withSetup - Should it execute the setup function?
     */
    SwitchToEScreen(id, withSetup = true) {
        if (this.screenmanager.HasScreen(id)) {
            const Screen = this.screenmanager.get(id);
            this.UpdateEScreen(Screen);
            utils.print("info", "Switched from Screen " + this.old.id + " to " + id);
            if (withSetup) {
                utils.print("info", "Executing setup function...");
                Screen.setup(this, Screen);
            }
        }
        else {
            utils.print("warn", "Screen " + id + " does not exist!");
        }
    }
    /**
     * Starts the Render
     */
    StartRender() {
        const mainWorker = require("./workers/main");
        mainWorker.MAIN(this);
    }
    /**
     * Stops the Render
     */
    StopRender() {
        cancelAnimationFrame(this.interval);
    }
    /**
     * Restarts the Render
     */
    RestartRender() {
        this.StopRender();
        this.StartRender();
    }
    /**
     * Closes the Program
     */
    closeWindow() {
        this.render.window.close();
    }
    createERender() {
        this.render = new render_1.ERender(this.window);
        return this.render;
    }
}
exports.EGame = EGame;
