const Mobjects = require("./objects")
const Maudio = require("./audio")
const game = require("./game")
const util = require("./utils")
const render = require("./render")

class EScreen
{
    /**
     * A EScreen with his own `setup` for first execution and `update` for every frame
     * @param {string} id - The name of the ID, for example: title, game, menu, multiplayer
     * @param {string} name - The displayname of the ID, for example: "Title Screen", "Ingame", "Main Menu", "Multiplayer" 
     * @param audio - A list of EAudio Objects
     * @param objects - A list of EObjects
     * @param setup - A function that only executes once
     * @param update - A function that executes every frame. Contains `ERender` as first Parameter
     */
    constructor(id="dummy",name="Dummy Screen Name",audio=[new Maudio.audio()],objects=[new Mobjects.door(),new Mobjects.main(),new Mobjects.player(),new Mobjects.trigger()],setup=function(){},update=function(Render=new render.render()){})
    {
        this.id = id
        this.name = name
        this.audio = audio
        this.objects = objects
        this.setup = setup
        this.update = update
    }
}
/**
 * The EScreen Manager. All EScreens are found here.
 */
const EScreens = new Map([["dummy",new EScreen("dummy","Dummy Screen Name",[],[],function(){alert("This is a Dummy Screen.")},function(){})]])
/**
 * Switch to a another EScreen
 * @param {string} id - The ID of the EScreen to switch
 * @param {number} level - The Level of the game
 * @param {boolean} withSetup - Should it execute the setup function?
 */
function SwitchToEScreen(id="dummy",level=0,withSetup=true)
{
    if(EScreens.has(id))
    {
        const Screen = EScreens.get(id)
        game.update({
            level:level,
            screen:id,
            updateFunc:Screen.update,
            eobjects:Screen.objects
        })
        util.print("info","Switched from Screen "+game.main.old.screen+" to "+id)
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
/**
 * Adds a EScreen to the EScreen Manager
 * @param {string} id - The name of the ID, for example: title, game, menu, multiplayer
 * @param {string} name - The displayname of the ID, for example: "Title Screen", "Ingame", "Main Menu", "Multiplayer" 
 * @param audio - A list of EAudio Objects
 * @param objects - A list of EObjects
 * @param setup - A function that only executes once
 * @param update - A function that executes every frame. Contains `ERender` as first Parameter
 */
function AddScreen(id="dummy",name="Dummy Screen Name",audio=[new Maudio.audio()],objects=[new Mobjects.door(),new Mobjects.main(),new Mobjects.player(),new Mobjects.playertemp(),new Mobjects.temp(),new Mobjects.trigger()],setup=function(){},update=function(Render=new render.render){})
{
    const ESCREEN = new EScreen(id,name,audio,objects,setup,update)
    if(!EScreens.has(id))
    {
        EScreens.set(id,ESCREEN)
        util.print("info","Added Screen "+id)
    }
    else
    {
        util.print("warn","Screen ID "+id+" already exists!")
    }
}
/**
 * Removes a EScreen from the EScreen Manager
 * @param {string} id - The ID of the EScreen to remove
 */
function RemoveScreen(id="dummy")
{
    if(EScreens.has(id))
    {
        EScreens.delete(id)
    }
    else
    {
        util.print("info","The Screen ID "+id+" already does not exist!")
    }
}
/**
 * Check if the EScreen already exists
 * @param {string} id - The ID of the EScreen to check 
 */
function HasScreen(id="dummy")
{
    if(EScreens.has(id))
    {
        return true
    }
    else
    {
        return false
    }
}

module.exports =
{
    EScreen:EScreen,
    EScreens:EScreens,
    SwitchToEScreen:SwitchToEScreen,
    add:AddScreen,
    has:HasScreen,
    remove:RemoveScreen
}
