const eobjects = require("./objects")

class EWidgetBase extends eobjects.EObject
{
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     * @param {string} type 
     * @param {string} sprite 
     * @param {number} index 
     */
    constructor(x,y,w,h,type,sprite,index)
    {
        super(x,y,w,h,type,sprite)
        this.index = index
    }
}
class EWidgetButton extends EWidgetBase
{
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     * @param {string} sprite 
     * @param {string} index 
     * @param {function(): void} onhover 
     * @param {function(): void} onclick 
     */
    constructor(x,y,w,h,sprite,index,onhover,onclick)
    {
        super(x,y,w,h,"button",sprite,index)
        this.onhover = onhover
        this.onclick = onclick
    }
}

module.exports = {
    EWidgetBase,
    EWidgetButton
}