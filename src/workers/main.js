const options = require("./../options.js")
const render = require("./../render")
const util = require("./../utils")

const update = require("./update")
const draw = require("./draw")

function main(Mtimestamp=0)
{
    const game = require("./../game")
    const Render = game.main.render
    if(document.getElementById("dfps"))
    {
        const FPS = render.FPSC(Render,Mtimestamp)
        document.getElementById("dfps").innerText = FPS
    }
    update(Render,game.main.current.updateFunc)
    draw(Render,game.main.current.eobjects)
    game.main.render.input.ControllerUpdate()
    game.intervalUpdate(Render.window.requestAnimationFrame(main))
}
function MAIN()
{
    const game = require("./../game")
    game.intervalUpdate(game.main.render.window.requestAnimationFrame(main))
    util.print("info","Started Main Worker")
}
module.exports =
{
    main:MAIN
}