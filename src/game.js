const utils = require("./utils")
const Escreen = require("./screen")
const remote = require("electron").remote
const eaudio = require("./audio")
const debug = require("./debug")
const EDiscord = require("./discord")
const error = require("./error")
const io = require("./io")
const eobjects = require("./objects")
const EOptions = require("./options")
const escreen = require("./screen")
const ewigets = require("./widget")
const ERender = require("./render")

class EDebug
{
    constructor()
    {
        /**
         * Returns `true` if debug is on
         */
        this.on=false
        /**
         * Draws the Hitboxes of `EObjects`
         */
        this.drawhitbox=false
        /**
         * See Stats like FPS, last key pressed, etc.
         */
        this.statsondisplay=false
        /**
         * Returns `true` if the developer tools by chrome is on
         */
        this.isdevconon=false
    }
}

class EHooks
{
    constructor()
    {
        /**
         * Executes before clearing the scene
         * @type {function(EGame): void}
         */
        this.beforedrawclear = function(game=new EGame()){}
        /**
         * Executes before drawing the scene (After Screen Clear)
         * @type {function(EGame): void}
         */
        this.beforedraw = function(game=new EGame()){}
        /**
         * Executes after drawing the scene
         * @type {function(EGame): void}
         */
        this.afterdraw = function(game=new EGame()){}
        /**
         * Executes before updating the scene
         * @type {function(EGame): void}
         */
        this.beforeupdate = function(game=new EGame()){}
        /**
         * Executes after updating the scene
         * @type {function(EGame): void}
         */
        this.afterupdate = function(game=new EGame()){}
    }
}

class EGame
{
    /**
     * The Heart of Eclipse Engine! Contains everything you need
     * @param {ERender} Render - The `ERender` Object 
     * @param {{}} Options - The 
     */
    constructor(Render,Options={})
    {
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
        this.current = new Escreen.EScreen()
        /**
         * Previous EScreen
         */
        this.old = new Escreen.EScreen()
        /**
         * `requestAnimationFrame` Interval
         */
        this.interval = 0
        /**
         * The Render Instance of this Instance
         */
        this.render = Render
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
        this.screenmanager = new Escreen.EScreenManager()
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
        this.io = io
        /**
         * EError Access
         */
        this.error = error
        /**
         * EDiscord Access
         */
        this.discord = EDiscord
        /**
         * EScreen Access
         */
        this.escreens = escreen
        /**
         * EObjects Access
         */
        this.eobjects = eobjects
        /**
         * EAudio Access
         */
        this.eaudio = eaudio
        /**
         * EWidgets Access
         */
        this.ewigets = ewigets
        /**
         * EDebug Access
         */
        this.debug = debug
        /**
         * Electron Access
         */
        this.electron = remote
        /**
         * Utilities Access
         */
        this.utils = utils
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
        this.options=EOptions.GetOptionFile()
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
            const Screen = this.screenmanager.map.get(id)
            this.UpdateEScreen(Screen)
            util.print("info","Switched from Screen "+this.old.id+" to "+id)
            if(withSetup)
            {
                util.print("info","Executing setup function...")
                Screen.setup(this,Screen)
            }
        }
        else
        {
            util.print("warn","Screen "+id+" does not exist!")
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
}
module.exports = EGame