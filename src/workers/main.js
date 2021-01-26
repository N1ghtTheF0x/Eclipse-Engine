const util = require("./../utils")

const draw = require("./draw")
const EGame = require("./../game")

function main(Mtimestamp=0,GAME=new EGame())
{
    const Game = GAME
    const Render = Game.render
    if(document.getElementById("dfps"))
    {
        const FPS = Render.FramesPerSecondCalc(Mtimestamp)
        document.getElementById("dfps").innerText = FPS
    }
    Game.current.update(Game,Game.current)
    draw.Tick(Game,Game.current.objects)
    Game.render.currentObjects = Game.current.objects
    Game.render.input.ControllerUpdate(0)
    Game.render.input.ControllerUpdate(1)
    Game.render.input.ControllerUpdate(2)
    Game.render.input.ControllerUpdate(3)
    Game.UpdateInterval(Render.window.requestAnimationFrame(function(time)
    {
        main(time,Game)
    }))
}
function MAIN(Game=new EGame())
{
    Game.UpdateInterval(Game.render.window.requestAnimationFrame(function(time)
    {
        main(time,Game)
    }))
    util.print("info","Started Main Worker")
}
module.exports = {MAIN}