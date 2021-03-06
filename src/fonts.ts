import {EUtils} from "./utils"
import {EObjects} from "./objects"

const utils: EUtils = new EUtils("fonts.ts")

type EFontImagePath = string

interface EFontLetter
{
    sx: number
    sy: number
    letter: string
}
class EFontLetter
{
    /**
     * literally just a Letter
     * @param {number} sx - X Source Position of the Letter
     * @param {number} sy - Y Source Position of the Letter
     * @param {string} letter - The Letter itself, duh
     */
    constructor(sx,sy,letter)
    {
        this.sx = sx
        this.sy = sy
        this.letter = letter[0]
    }
}

export interface EFontManager
{

}
export class EFontManager extends Map<number,EFont>
{
    constructor()
    {
        super()
    }
    createFont(name: string,width: number,height: number,fontpng: EFontImagePath): EFont
    {
        return new EFont(name,width,height,fontpng)
    }
}

interface EFont
{
    name: string
    w: number
    h: number
    fontpng: EFontImagePath
    _image: HTMLImageElement
    fontmap: Map<string,EFontLetter>
}
class EFont
{
    /**
     * A Font containing Letters
     * @param {string} name - Name of the Font like `monospace` 
     * @param {number} width - Width of ONE Letter
     * @param {number} height - Height of ONE Letter
     * @param {string} fontpng - Path to the Font Image 
     */
    constructor(name: string,width: number,height: number,fontpng: EFontImagePath)
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
    removeLetter(letter)
    {
        if(this.fontmap.has(letter))
        {
            this.fontmap.delete(letter)
        }
        else
        {
            utils.print("warn","Letter "+letter+" already does no exist!")
        }
    }
    /**
     * Turns the Letter into a `EObject`
     * @param {string} letter - The Letter to turn into
     * @param {number} x - X-Position
     * @param {number} y - Y-Position
     */
    LetterToEObject(letter,x,y)
    {
        if(this.fontmap.has(letter))
        {
            const Letter = this.fontmap.get(letter)
            const obj = EObjects.CreateEObject(x,y,this.w,this.h,"letter",this.fontpng)
            obj.AddAnimation(Letter.sx,Letter.sy,this.w,this.h)
            obj.SetAnimation(0)
            return obj
        }
        else
        {
            utils.print("warn","Letter "+letter+" does no exist!")
        }
    }
    /**
     * Write Text to a list of converted `Eobject`
     * @param {string} text - The Text to write 
     * @param {number} x - X-Position
     * @param {number} y - Y-Position
     */
    WriteText(text,x,y)
    {
        var offset = 0
        const splitted = text.split("")
        const splittedlength = splitted.length
        var currentletter = 0
        /**
         * @type {eobjects.EObject[]}
         */
        const list = []
        /**
         * @param {EFont} fontmap
         * @param {string} letter 
         */
        function ReturnLetter(fontmap,letter)
        {
            if(fontmap.fontmap.has(letter))
            {
                const Letter = fontmap.fontmap.get(letter)
                const Obj = fontmap.LetterToEObject(letter,x+offset,y)
                list.push(Obj)
                offset+=fontmap.w
                currentletter++
                return Letter
            }
            else
            {
                const obj = fontmap.LetterToEObject(" ",x+offset,y)
                offset+=fontmap.w
                currentletter++
                return obj
            }
            
        }
        if(currentletter<splittedlength)
        {
            list.push(ReturnLetter(this,splitted[currentletter]))
        }
        else
        {
            return list
        }
    }
}