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
            eobjects:[new eobjectM.main(0,0,0,0,"dummy",null),new eobjectM.temp()]
        }
        this.old =
        {
            level:0,
            screen:"dummy",
            updateFunc:function(Render=new render.render()){},
            eobjects:[new eobjectM.main(0,0,0,0,"dummy",null),new eobjectM.temp()]
        }
        this.interval = 0
        this.render = undefined||new render.render()
        this.options = {hardware:false,mute:false,discordrpc:{id:"",tokem:""}}
    }
}

const game = new EGame()

function UpdateGame(data={level:0,screen:"dummy",updateFunc:function(Render=new render.render()){},eobjects:[new eobjectM.main(0,0,0,0,"dummy",null),new eobjectM.temp()]})
{
    game.old=game.current
    game.current.eobjects = data.eobjects
    game.current.level = data.level
    game.current.screen = data.screen
    game.current.updateFunc = data.updateFunc
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
function UpdateOptions(optionsOBJ=new options.template())
{
    game.options=optionsOBJ
    //options.set(game.options)
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