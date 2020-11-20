const eobjectM = require("./objects")
const render = require("./render")

const game =
{
    fps:0,
    current:
    {
        level:0,
        screen:"dummy",
        updateFunc:function(Render=new render.render()){},
        eobjects:[new eobjectM.main(0,0,0,0,"dummy",null),new eobjectM.temp()]
    },
    old:
    {
        level:0,
        screen:"dummy",
        updateFunc:function(Render=new render.render()){},
        eobjects:[new eobjectM.main(0,0,0,0,"dummy",null),new eobjectM.temp()]
    },
    interval:0
}

function UpdateGame(data={level:0,screen:"dummy",updateFunc:function(Render=new render.render()){},eobjects:[new eobjectM.main(0,0,0,0,"dummy",null),new eobjectM.temp()]})
{
    game.old=game.current
    game.current.eobjects = data.eobjects
    game.current.level = data.level
    game.current.screen = data.screen
    game.current.updateFunc = data.updateFunc
}
function UpdateInterval(interval=0)
{
    game.interval=interval
}
module.exports =
{
    main:game,
    update:UpdateGame,
    intervalUpdate:UpdateInterval
}