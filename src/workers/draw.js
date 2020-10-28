const util = require("./../utils")
const render = require("./../render")


function Tick()
{
    render.Clear()
    render.Draw()
}
module.exports =
{
    tick:Tick
}
