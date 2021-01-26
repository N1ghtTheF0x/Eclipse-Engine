const utils = require("./utils")

class EFontLetter
{
    /**
     * literally just a Letter
     * @param {number} x - X Source Position of the Letter
     * @param {number} y - Y Source Position of the Letter
     * @param {string} letter - The Letter itself, duh
     */
    constructor(x,y,letter)
    {
        this.x = x
        this.y = y
        this.letter = letter[0]
    }
}

module.exports = class EFont
{
    /**
     * A Font containing Letters
     * @param {string} name - Name of the Font like `monospace` 
     * @param {number} width - Width of ONE Letter
     * @param {number} height - Height of ONE Letter
     * @param {string} fontpng - Path to the Font Image 
     */
    constructor(name,width,height,fontpng)
    {
        this.name = name
        this.w = width
        this.h = height
        this.fontpng = fontpng
        this._image = new Image()
        this._image.src = fontpng
        /**
         * @type Map<string,EFontLetter>
         */
        this.fontmap = new Map()
    }
    /**
     * Adds an Letter to the Font
     * @param {number} x - X Source Position of the Letter 
     * @param {number} y - X Source Position of the Letter 
     * @param {string} letter - Well, uh, the Letter?
     */
    addLetter(x,y,letter)
    {
        const Letter = new EFontLetter(x,y,letter)
        if(!this.fontmap.has(letter))
        {
            this.fontmap.set(letter,Letter)
        }
        else
        {
            utils.print("warn","Letter "+letter[0]+" in EFont "+this.name+" already exists!")
        }
    }
}