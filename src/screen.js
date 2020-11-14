const Mobjects = require("./objects")
const Maudio = require("./audio")
const game = require("./game")
const util = require("./utils")
const Controls = require("./input").controls

class EScreen
{
    constructor(id="dummy",name="Dummy Screen Name",audio=[new Maudio.audio()],objects=[new Mobjects.door(),new Mobjects.main(),new Mobjects.player(),new Mobjects.playertemp(),new Mobjects.temp(),new Mobjects.trigger()],setup=function(){},update=function(controls=Controls){})
    {
        this.id = id
        this.name = name
        this.audio = audio
        this.objects = objects
        this.setup = setup
        this.update = update
    }
}

const EScreens = new Map([["dummy",new EScreen("dummy","Dummy Screen Name",[],[],function(){alert("This is a Dummy Screen.")},function(){})]])

function SwitchToEScreen(id="dummy",level=0)
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
    }
    else
    {
        util.print("warn","Screen "+id+" does not exist!")
    }
}

function AddScreen(id="dummy",name="Dummy Screen Name",audio=[new Maudio.audio()],objects=[new Mobjects.door(),new Mobjects.main(),new Mobjects.player(),new Mobjects.playertemp(),new Mobjects.temp(),new Mobjects.trigger()],setup=function(){},update=function(){})
{
    const ESCREEN = new EScreen(id,name,audio,objects,setup,update)
    if(!EScreens.has(id))
    {
        EScreens.set(id,ESCREEN)
        util.print("info","Added Screen "+id)
    }
    else
    {
        util.print("warn","Screen "+id+" already exists!")
    }
}

module.exports =
{
    EScreen:EScreen,
    EScreens:EScreens,
    SwitchToEScreen:SwitchToEScreen,
    add:AddScreen
}
