const utils = require("./../utils")
const render = require("./../render")
const game = require("./../game")
function Tick(Render=new render.render(),UpdateFunction=function(Render=new render.render()){})
{
    if(game.main.current.eobjects)
    {
        for(const widget of game.main.current.eobjects)
        {
            if(widget instanceof Render.ewigets.button)
            {
                function IsCursorInside()
                {
                    const Cursor = Render.input.cursor
                    if(Cursor.x<widget.x+widget.w&&
                       Cursor.x+1>widget.x&&
                       Cursor.y<widget.y+widget.h&&
                       Cursor.y+1>widget.y)
                    {
                        if(widget.onhover)
                        {
                            widget.onhover()
                        }
                        if(Cursor.left)
                        {
                            widget.onclick()
                        }
                    }
                }
                IsCursorInside()
            }
        }
    }
    UpdateFunction(Render)
}
module.exports = Tick