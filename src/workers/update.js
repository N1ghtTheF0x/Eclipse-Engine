const EGame = require("./../game")
function Tick(Game=new EGame(),UpdateFunction=function(Game=new EGame()){})
{
    UpdateFunction(Game)
}
module.exports = Tick