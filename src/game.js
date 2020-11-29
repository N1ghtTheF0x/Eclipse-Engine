const eobjectM = require("./objects")
const renderM = require("./render")
const utils = require("./utils")
const options = require("./options")

const {render} = require("./render")

class EGame
{
    constructor()
    {
        this.fps = 0
        this.current =
        {
            level:0,
            screen:"dummy",
            updateFunc:function(Render=new renderM.render()){},
            eobjects:[new eobjectM.main(0,0,0,0,"dummy","./textures/unknown.png")]
        }
        this.old =
        {
            level:0,
            screen:"dummy",
            updateFunc:function(Render=new renderM.render()){},
            eobjects:[new eobjectM.main(0,0,0,0,"dummy","./textures/unknown.png")]
        }
        this.interval = 0
        this.render = undefined
        this.options = {}
    }
}

const game = new EGame()

function UpdateGame(data={level:0,screen:"dummy",updateFunc:function(Render=new renderM.render()){},eobjects:[new eobjectM.main(0,0,0,0,"dummy",null)],options:new options()})
{
    game.old=game.current
    game.current.eobjects = data.eobjects
    game.current.level = data.level
    game.current.screen = data.screen
    game.current.updateFunc = data.updateFunc
    game.options = options
    utils.print("info","Updated Game Variables")
}
function UpdateRender(Render=new renderM.render())
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