const Mobjects = require("./objects")
const Mwidgets = require("./widget")
const Maudio = require("./audio")
const util = require("./utils")
const EGame = require("./game")

class EScreen
{
    /**
     * A EScreen with his own `setup` for first execution and `update` for every frame
     * @param {string} id - The name of the ID, for example: title, game, menu, multiplayer
     * @param {string} name - The displayname of the ID, for example: "Title Screen", "Ingame", "Main Menu", "Multiplayer" 
     * @param {(Maudio.EAudio|Maudio.EAudioAllegro|Maudio.EAudioBoost|Maudio.EAudioIntroLoop|Maudio.EAudioStepUp)[]} audio - A list of EAudio Objects
     * @param {()[]} objects - A list of EObjects
     * @param {(Mwidgets.EWidgetBase,Mwidgets.EWidgetButton)[]} widgets - A List of EWidgets
     * @param {function(EGame,EScreen): void} setup - A function that only executes once
     * @param {function(EGame,EScreen): void} update - A function that executes every frame. Contains `ERender` as first Parameter
     */
    constructor(id,name,audio,objects,widgets,setup,update)
    {
        this.id = id
        this.name = name
        this.audio = audio
        this.objects = objects
        this.widgets = widgets
        this.setup = setup
        this.update = update
    }
    /**
     * Resets all EObjects
     */
    resetObjects()
    {
        for(const object of this.objects)
        {
            object.x=object._x
            object.y=object._y
            object.z=object._z
            object.ang=0
            object.w=object._w
            object.h=object._h

            object.xsp=0
            object.ysp=0
            object.gsp=0
        }
    }
}
class EScreenManager
{
    /**
    * The EScreen Manager. All EScreens are found here.
    */
    constructor()
    {
        /**
         * @type {Map<string,EScreen>}
         */
        this.map = new Map([["dummy",new EScreen("dummy","Dummy Screen Name",[],[],function(){alert("This is a Dummy Screen.")},function(){})]])
    }   
    /**
     * Adds a EScreen to the EScreen Manager
     * @param {string} id - The name of the ID, for example: title, game, menu, multiplayer
     * @param {string} name - The displayname of the ID, for example: "Title Screen", "Ingame", "Main Menu", "Multiplayer" 
     * @param {(Maudio.EAudio|Maudio.EAudioAllegro|Maudio.EAudioBoost|Maudio.EAudioIntroLoop|Maudio.EAudioStepUp)[]} audio - A list of EAudio Objects
     * @param {()[]} objects - A list of EObjects
     * @param {(Mwidgets.EWidgetBase,Mwidgets.EWidgetButton)[]} widgets - A List of EWidgets
     * @param {function(EGame,EScreen): void} setup - A function that only executes once
     * @param {function(EGame,EScreen): void} update - A function that executes every frame. Contains `ERender` as first Parameter
     */
    AddScreen(id,name,audio,objects,setup,update)
    {
        const ESCREEN = new EScreen(id,name,audio,objects,widgets,setup,update)
        if(!this.map.has(id))
        {
            this.map.set(id,ESCREEN)
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
    RemoveScreen(id)
    {
        if(this.map.has(id))
        {
            this.map.delete(id)
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
    HasScreen(id)
    {
        if(this.map.has(id))
        {
            return true
        }
        else
        {
            return false
        }
    }
}

module.exports =
{
    EScreen,
    EScreenManager
}
