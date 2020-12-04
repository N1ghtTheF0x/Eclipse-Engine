const eobjects = require("./objects")

class EWidgetBase extends eobjects.main
{
    constructor(x=0,y=0,w=0,h=0,type="dummy",sprite="",index=0)
    {
        super(x,y,w,h,type,sprite)
        this.index = index
    }
}
class EWidgetButton extends EWidgetBase
{
    constructor(x=0,y=0,w=0,h=0,sprite="",index=0,onhover=function(){},onclick=function(){})
    {
        super(x,y,w,h,"button",sprite,index)
        this.onhover = onclick
        this.onclick = onclick
    }
}

module.exports = {
    base:EWidgetBase,
    button:EWidgetButton
}