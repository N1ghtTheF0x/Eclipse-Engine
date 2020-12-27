const utils = require("./utils")
const Escreen = require("./screen")
const remote = require("electron").remote
const eaudio = require("./audio")
const debug = require("./debug")
const discord = require("./discord")
const error = require("./error")
const io = require("./io")
const eobjects = require("./objects")
const EOptions = require("./options")
const escreen = require("./screen")
const ewigets = require("./widget")
const ERender = require("./render")

class EHooks
{
    constructor()
    {
        /**
         * Executes before clearing the scene
         * @param {EGame} game 
         */
        this.beforedrawclear = function(game=new EGame()){}
        /**
         * Executes before drawing the scene (After Screen Clear)
         * @param {EGame} game 
         */
        this.beforedraw = function(game=new EGame()){}
        /**
         * Executes after drawing the scene
         * @param {EGame} game 
         */
        this.afterdraw = function(game=new EGame()){}
        /**
         * Executes before updating the scene
         * @param {EGame} game 
         */
        this.beforeupdate = function(game=new EGame()){}
        /**
         * Executes after updating the scene
         * @param {EGame} game 
         */
        this.afterupdate = function(game=new EGame()){}
    }
}

class EGame
{
    constructor(Render=new ERender(),Options={})
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
         */
        this.discordrpc = new discord("","")
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
         * DEBUG enabler
         */
        this.DEBUG = false
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
        this.discord = discord
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
    UpdateEScreen(newEScreen=new Escreen.EScreen())
    {
        this.old=this.current
        this.current = newEScreen
        utils.print("info","Updated Game Variables")
    }
    UpdateRender(Render=new ERender())
    {
        this.render=Render
        utils.print("info","Updated Game Render")
    }
    UpdateInterval(interval=0)
    {
        this.interval=interval
    }
    UpdateOptions()
    {
        this.options=EOptions.GetOptionFile()
    }
    UpdateDiscord(Discord=new discord("",""))
    {
        this.discordrpc=Discord
    }
    /**
     * Switch to a another EScreen
     * @param {string} id - The ID of the EScreen to switch
     * @param {number} level - The Level of the game
     * @param {boolean} withSetup - Should it execute the setup function?
     */
    SwitchToEScreen(id="dummy",level=0,withSetup=true)
    {
        if(this.screenmanager.HasScreen(id))
        {
            const Screen = this.screenmanager.map.get(id)
            this.UpdateEScreen(Screen)
            util.print("info","Switched from Screen "+this.old.id+" to "+id)
            if(withSetup)
            {
                util.print("info","Executing setup function...")
                Screen.setup()
            }
        }
        else
        {
            util.print("warn","Screen "+id+" does not exist!")
        }
    }
    StartRender()
    {
        const mainWorker = require("./workers/main").main
        mainWorker(this)
    }
    StopRender()
    {
        cancelAnimationFrame(this.interval)
    }
    RestartRender()
    {
        this.StopRender()
        this.StartRender()
    }
}
module.exports = EGame