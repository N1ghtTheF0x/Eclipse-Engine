const EGame = require("./../game")
function Tick(Game=new EGame(),UpdateFunction=function(Game=new EGame()){})
{
    Game.hooks.beforeupdate(Game)
    UpdateFunction(Game)
    Game.hooks.afterupdate(Game)
}
module.exports = {Tick}