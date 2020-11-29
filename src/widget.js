var idGiver = 0

class EWidgetBase
{
    constructor(x=0,y=0,w=0,h=0,type="dummy",sprite="")
    {
        this.sprite = sprite
        this.error = false
        this._image = new Image()
        try
        {
            this._image.src = this.sprite
        }
        catch(err)
        {
            util.print("warn","Couldn't set Image to "+sprite+"! Using default image.")
            util.print("error",err)
            this._image.src = "./textures/common/unknown.png"
            this.error=true
        }
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.type = type
        this.id = idGiver
        idGiver++
    }
}
class EWidgetButton extends EWidgetBase
{
    constructor(x=0,y=0,w=0,h=0,sprite="",onhover=function(){},onclick=function(){})
    {
        super(x,y,w,h,"button",sprite)
        this.onhover = onclick
        this.onclick = onclick
    }
}

module.exports = {
    base:EWidgetBase,
    button:EWidgetButton
}