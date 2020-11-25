const eobjectM = require("./objects")
const render = require("./render")
const utils = require("./utils")
const options = require("./options")

class EGame
{
    constructor()
    {
        this.fps = 0
        this.current =
        {
            level:0,
            screen:"dummy",
            updateFunc:function(Render=new render.render()){},
            eobjects:[new eobjectM.main(0,0,0,0,"dummy","./textures/unknown.png"),new eobjectM.temp()]
        }
        this.old =
        {
            level:0,
            screen:"dummy",
            updateFunc:function(Render=new render.render()){},
            eobjects:[new eobjectM.main(0,0,0,0,"dummy","./textures/unknown.png"),new eobjectM.temp()]
        }
        this.interval = 0
        this.render = undefined
        this.options = {}
    }
}

const game = new EGame()

function UpdateGame(data={level:0,screen:"dummy",updateFunc:function(Render=new render.render()){},eobjects:[new eobjectM.main(0,0,0,0,"dummy",null),new eobjectM.temp()],options:new options()})
{
    game.old=game.current
    game.current.eobjects = data.eobjects
    game.current.level = data.level
    game.current.screen = data.screen
    game.current.updateFunc = data.updateFunc
    game.options = options
    utils.print("info","Updated Game Variables")
}
function UpdateRender(Render=new render.render())
{
    game.render=Render
    utils.print("info","Updated Game Render")
}
function UpdateInterval(interval=0)
{
    game.interval=interval
}
function UpdateOptions(Options=new options())
{
    game.options=Options
    Options.WriteOptions(Options)
}
module.exports =
{
    main:game,
    update:UpdateGame,
    intervalUpdate:UpdateInterval,
    renderUpdate:UpdateRender,
    class:EGame,
    OptionsUpdate:UpdateOptions
}