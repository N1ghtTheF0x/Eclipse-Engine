import {EUtils} from "./utils"
import {EScreens} from "./screen"
import * as electron from "electron"
import {EAudios} from "./audio"
import {EDebug} from "./debug"
import {EDiscordManager,EDiscord} from "./discord"
import {EIOManager} from "./io"
import {EObjects} from "./objects"
import {EOptions} from "./options"
import {ERender} from "./render"
import {EFontManager} from "./fonts"
import {EInput} from "./input"

const utils: EUtils = new EUtils("game.ts")
const options: EOptions = null

type BeforeDrawClear = (game: EGame) => void
type BeforeDraw = (game: EGame) => void
type AfterDraw = (game: EGame) => void
type BeforeUpate = (game: EGame) => void
type AfterUpdate = (game: EGame) => void


interface EHooks
{
    beforedrawclear: BeforeDrawClear
    beforedraw: BeforeDraw
    afterdraw: AfterDraw
    beforeupdate: BeforeUpate
    afterupdate: AfterUpdate
}
class EHooks
{
    constructor()
    {
        /**
         * Executes before clearing the scene
         * @type {function(EGame): void}
         */
        this.beforedrawclear = function(game){}
        /**
         * Executes before drawing the scene (After Screen Clear)
         * @type {function(EGame): void}
         */
        this.beforedraw = function(game){}
        /**
         * Executes after drawing the scene
         * @type {function(EGame): void}
         */
        this.afterdraw = function(game){}
        /**
         * Executes before updating the scene
         * @type {function(EGame): void}
         */
        this.beforeupdate = function(game){}
        /**
         * Executes after updating the scene
         * @type {function(EGame): void}
         */
        this.afterupdate = function(game){}
    }
}

export interface EGame
{
    fps: number
    hooks: EHooks
    current: EScreens.EScreen
    old: EScreens.EScreen
    interval: number
    render: ERender
    options: {}
    hardware: boolean
    discordrpc: EDiscord
    screenmanager: EScreens.EScreenManager
    buttonIndex: number
    packaged: boolean
    DEBUG: EDebug
    dialog: electron.Dialog
    utils: typeof EUtils
    eobjects: {CreateEObject: EObjects.CreateEObjectFunc,CreateEObjectPlayer: EObjects.CreateEObjectPlayerFunc}
    discord: EDiscordManager
    input: EInput
    eaudio: EAudios.EAudioManager
    efont: EFontManager
    io: EIOManager
    eoptions: EOptions
    window: Window
}
export class EGame
{
    /**
     * The Heart of Eclipse Engine! Contains everything you need
     * @param {{}} Options - The 
     */
    constructor(WINDOW: Window,Options: {})
    {
        this.window = WINDOW
        /**
         * Frames per Second of this Instance
         */
        this.fps = 0
        /**
         * A Collection of Hooks
         */
        this.hooks = new EHooks()
        /**
         * Currently viewing EScreen
         */
        this.current = null
        /**
         * Previous EScreen
         */
        this.old = null
        /**
         * `requestAnimationFrame` Interval
         */
        this.interval = 0
        /**
         * The Render Instance of this Instance
         */
        this.render = null
        /**
         * Game Options
         */
        this.options = Options
        /**
         * Enable WebGL Render?
         */
        this.hardware = false
        /**
         * Discord Client of this Instance
         * @type {EDiscord}
         */
        this.discordrpc = null
        /**
         * All EScreens of this Instance. **THEY ARE IN THE PROPERTY `map`!!!!**
         */
        this.screenmanager = new EScreens.EScreenManager()
        /**
         * Currently selected button
         */
        this.buttonIndex = 0
        /**
         * Is this game packaged?
         */
        this.packaged = __dirname.includes("app.asar")
        /**
         * Check debugging stuff
         */
        this.DEBUG = new EDebug()
        /**
         * E I/O Access
         */
        this.io = new EIOManager()
        /**
         * EDiscord Access
         */
        this.discord = new EDiscordManager()
        /**
         * EObjects Access
         */
        this.eobjects = {CreateEObject:EObjects.CreateEObject,CreateEObjectPlayer:EObjects.CreateEObjectPlayer}
        /**
         * EAudioManager Access
         */
        this.eaudio = new EAudios.EAudioManager()
        /**
         * Electron Access
         */
        this.dialog = electron.dialog
        /**
         * Utilities Access
         */
        this.utils = EUtils
        /**
         * EFont Access
         */
        this.efont = new EFontManager()
        this.input = new EInput(this.window)
        this.eoptions = null
    }
    /**
     * Updates the current `EScreen`
     * @param {Escreen.EScreen} newEScreen - The new `EScreen` Object
     */
    UpdateEScreen(newEScreen)
    {
        this.old=this.current
        this.current = newEScreen
        utils.print("info","Updated Game Variables")
    }
    /**
     * Updates the current `ERender`
     * @param {ERender} Render - The new `ERender` Object
     */
    UpdateRender(Render)
    {
        this.render=Render
        utils.print("info","Updated Game Render")
    }
    /**
     * Updates the ID of the `requestAnimationFrame`
     * @param {number} interval 
     */
    UpdateInterval(interval)
    {
        this.interval=interval
    }
    /**
     * Update Options
     */
    UpdateOptions()
    {
        this.options=options.GetOptionFile()
    }
    /**
     * Updates the Discord Client
     * @param {EDiscord} Discord 
     */
    UpdateDiscord(Discord)
    {
        this.discordrpc=Discord
    }
    /**
     * Switch to a another EScreen
     * @param {string} id - The ID of the EScreen to switch
     * @param {boolean} withSetup - Should it execute the setup function?
     */
    SwitchToEScreen(id,withSetup=true)
    {
        if(this.screenmanager.HasScreen(id))
        {
            const Screen = this.screenmanager.get(id)
            this.UpdateEScreen(Screen)
            utils.print("info","Switched from Screen "+this.old.id+" to "+id)
            if(withSetup)
            {
                utils.print("info","Executing setup function...")
                Screen.setup(this,Screen)
            }
        }
        else
        {
            utils.print("warn","Screen "+id+" does not exist!")
        }
    }
    /**
     * Starts the Render
     */
    StartRender()
    {
        const mainWorker = require("./workers/main")
        mainWorker.MAIN(this)
    }
    /**
     * Stops the Render
     */
    StopRender()
    {
        cancelAnimationFrame(this.interval)
    }
    /**
     * Restarts the Render
     */
    RestartRender()
    {
        this.StopRender()
        this.StartRender()
    }
    /**
     * Closes the Program
     */
    closeWindow()
    {
        this.render.window.close()
    }
    createERender(): ERender
    {
        this.render = new ERender(this.window)
        return this.render
    }
}