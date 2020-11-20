const utils = require("./../utils")
const render = require("./../render")
function Tick(Render=new render.render(),UpdateFunction=function(Render=new render.render()){})
{
    UpdateFunction(Render)
}
module.exports = Tick