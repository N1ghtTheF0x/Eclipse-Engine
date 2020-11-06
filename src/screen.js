const Mobjects = require("./objects")
const Maudio = require("./audio")

class EScreen
{
    constructor(id="dummy",name="Dummy Screen Name",audio=[new Maudio.audio()],tiles=[],objects=[new Mobjects.door(),new Mobjects.main(),new Mobjects.player(),new Mobjects.playertemp(),new Mobjects.temp(),new Mobjects.trigger()],setup=function(){},update=function(){})
    {
        this.id = id
        this.name = name
        this.audio = audio
        this.tiles = tiles
        this.objects = objects
        this.setup = setup
        this.update = update
    }
}

const EScreens = new Map([["dummy",new EScreen("dummy","Dummy Screen Name",[],[],[],function(){alert("This is a Dummy Screen.")},function(){})]])


module.exports =
{
    EScreen:EScreen,
    EScreens:EScreens
}