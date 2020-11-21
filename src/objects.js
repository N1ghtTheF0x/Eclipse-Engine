const util = require("./utils")
const render = require("./render")
var idGiver = 0

class EObjectClass
{
    /**
     * The EObjectClass. It's the main framework for every object in this Game Engine
     * @param {number} x - X Position | any value 
     * @param {number} y - Y Position | any value
     * @param {number} w - Width | any value
     * @param {number} h - Height | any value
     * @param {number} type - The type of object like player, object, enemy, hazard and so on
     */
    constructor(x=0,y=0,w=0,h=0,type="dummy")
    {
        /**
         * X Position
         */
        this.x = x
        this._x = this.x
        this.mx = this.x
        /**
         * Y Position
         */
        this.y = y
        this._y = this.y
        this.my = this.y
        /**
         * Width
         */
        this.w = w
        /**
         * Height
         */
        this.h = h
        /**
         * X-Speed
         */
        this.xsp = 0
        /**
         * Y-Speed
         */
        this.ysp = 0
        this.yspm = 1
        /**
         * Ground-Speed
         */
        this.gsp = 0
        /**
         * Slope angle
         */
        this.slope = 0
        /**
         * Angle
         */
        this.ang = 0
        /**
         * Type
         */
        this.type = type
        /**
         * ID
         */
        this.id = idGiver
        idGiver++
        /**
         * @unused
         */
        this.wantsRotate=false
        this.acc = 0.046875 // Default 0.046875
        this.dec = 0.5 // Default 0.5
        this.frc = 0.046875 // Default 0.046875
        this.top = 6 // Default 6
        this.slp = 0.125 // Default 0.125
        this.slpru = 0.078125 // Default 0.078125
        this.slprd = 0.3125 // Default 0.3125
        
        this.air = 0.09375 // Default 0.09375
        this.jump = 6.5 // Default 6.5
        this.grv = 0.21875 // Default 0.21875
    }
}
class EObjectTEMP extends EObjectClass
{
    /**
     * A Dirty Object Creator for temporal object placement
     * @param {number} x - X Position | any value 
     * @param {number} y - Y Position | any value
     * @param {number} w - Width | any value
     * @param {number} h - Height | any value
     * @param {string} type - Type of object
     * @param {string} color - The color of the object, You can use RGBA(0,0,0,0) to get an invisible object
     */
    constructor(x=0,y=0,w=0,h=0,type="dummy",color="blue")
    {
        super(x,y,w,h,type)
        /**
         * The color of the object
         */
        this.color = color
    }
    /*
    draw()
    {
        render.ctx.fillStyle = this.color
        render.ctx.fillRect(this.x*drawFaktor,this.y*drawFaktor,this.w*drawFaktor,this.h*drawFaktor)
    }
    drawHitbox()
    {
        render.ctx.fillStyle = util.RGBA(0,255,0,0.25)
        render.ctx.fillRect(0,0,this.w*drawFaktor,this.h*drawFaktor)
    }*/
}
class EObject extends EObjectClass
{
    /**
     * The real EObject with a spritesheet instead of a single color
     * @param {number} x - X Position 
     * @param {number} y - Y Position
     * @param {number} w - Width
     * @param {number} h - Height
     * @param {string} type - Type
     * @param {string} spritesheet - Path to spritesheet 
     */
    constructor(x=0,y=0,w=0,h=0,type="dummy",spritesheet="none",)
    {
        super(x,y,w,h,type)
        /**
         * The Path to the spritesheet
         */
        this.spritesheet = spritesheet
        /**
         * Source X of Picture
         */
        this.sx = 0
        /**
         * Source Y of Picture
         */
        this.sy = 0
        /**
         * Source Width of Picture
         */
        this.sw = this.w
        /**
         * Source Height of Picture
         */
        this.sh = this.h
        this._image = new Image()
        try
        {
            this._image.src = spritesheet
        }
        catch(err)
        {
            util.print("warn","Couldn't set Image to "+spritesheet+"! Using default image.")
            util.print("error",err)
            this._image.src = "./textures/unknown.png"
        }
        this._canvas = document.createElement('canvas')
        this._canvas.height = this.h
        this._canvas.width = this.w
        this._ctx = this._canvas.getContext("2d")
        this._ctx.imageSmoothingEnabled=false
        /**
         * A array containing various animations. Keep in mind you have to add the animations yourself using the `AddAnimation` function
         */
        this.animation = [{sx:this.sx,sy:this.sy,sw:this.sw,sh:this.sh}]
        /**
         * Use to calcute when to use which animation
         */
        this.animationTimer = 0
        /**
         * The current index of the animation array
         */
        this.curAnimation = 0
    }
    /**
     * Add a animation to the EObject
     * @param {number} sx - Source X 
     * @param {number} sy - Source Y 
     * @param {number} sw - Source Width 
     * @param {number} sh - Source Height
     */
    AddAnimation(sx=0,sy=0,sw=0,sh=0)
    {
        this.animation.push({sx:sx,sy:sy,sw:sw,sh:sh})
    }
    /**
     * Sets the animation to the EObject by Index
     * @param {number} index - The Index of the animation 
     */
    SetAnimation(index=0)
    {
        const aniObj = this.animation[index]
        this.sx=aniObj.sx
        this.sy=aniObj.sy
        this.sw=aniObj.sw
        this.sh=aniObj.sh
        this.w=aniObj.sw
        this.h=aniObj.sh
        this._canvas.height = this.h
        this._canvas.width = this.w
    }
    /**
     * 
     * @unused 
     */
    rotate(deg=90)
    {
        const calc = deg*Math.PI/180
        this._ctx.translate(((this.x+this.w)/2),((this.y+this.h)/2))
        this._ctx.rotate(calc)
        this._ctx.translate(-((this.x+this.w)/2),-((this.y+this.h)/2))
        this.ang=deg
    }
    /*
    draw()
    {
        this._ctx.clearRect(0,0,this.w,this.h)
        this._ctx.drawImage(this._image,this.sx,this.sy,this.sw,this.sh,0,0,this.w,this.h)
        render.ctx.drawImage(this._canvas,0,0,this.w,this.h,this.x*drawFaktor,this.y*drawFaktor,this.w*drawFaktor,this.h*drawFaktor)
    }

    drawHitbox()
    {
        this._ctx.fillStyle = util.RGBA(0,255,0,0.25)
        this._ctx.fillRect(0,0,this.w*drawFaktor,this.h*drawFaktor)
    }*/
}
class EObjectPlayerTEMP extends EObjectTEMP
{
    /**
     * The Player temporal Object. This should only exist once!
     * @param {number} x - X Position
     * @param {number} y - Y Position
     * @param {number} w - Width
     * @param {number} h - Height
     * @param {string} color - The Color
     */
    constructor(x=0,y=0,w=0,h=0,color="")
    {
        super(x,y,w,h,"player",color)
        /**
         * Is the player jumping at the moment?
         */
        this.jumping=false
        /**
         * Is the player on the ground? This value can even be false sometimes if he's on the ground
         */
        this.ground=false
        /**
         * Which direction the player is facing?
         */
        this.facing = "none"||"left"||"right"
        /**
         * Got the Player hit by something like an enemy or hazard?
         */
        this.hit = false
        /**
         * Can the player move around with keyboard or controller? Can be set to disable/enable player controls
         */
        this.canMove = true
        /**
         * For Multiplayer
         */
        this.name = ""
        /**
         * If `true` the player will ignore collision
         */
        this.ignoreCollision = false
        /**
         * Turns the player into a GOD!
         */
        this.godmode = false
    }
}
class EObjectPlayer extends EObject
{
    /**
     * The Player Object. This should only exist once!
     * @param {number} x - X Position
     * @param {number} y - Y Position
     * @param {number} w - Width
     * @param {number} h - Height
     * @param {string} spritesheet - Path to the stylesheet 
     */
    constructor(x=0,y=0,w=0,h=0,spritesheet="")
    {
        super(x,y,w,h,"player",spritesheet)
        /**
         * Is the player jumping at the moment?
         */
        this.jumping=false
        /**
         * Is the player on the ground? This value can even be false sometimes if he's on the ground
         */
        this.ground=false
        /**
         * Which direction the player is facing?
         */
        this.facing = "none"||"left"||"right"
        /**
         * Got the Player hit by something like an enemy or hazard?
         */
        this.hit = false
        /**
         * Can the player move around with keyboard or controller? Can be set to disable/enable player controls
         */
        this.canMove = true
        /**
         * For Multiplayer
         */
        this.name = ""
        /**
         * If `true` the player will ignore collision
         */
        this.ignoreCollision = false
        /**
         * Turns the player into a GOD!
         */
        this.godmode = false
    }
}
class ETrigger extends EObjectClass
{
    /**
     * This is a Trigger Object, when the player is inside this, `ontrigger` gets executed
     * @param {number} x - X Position 
     * @param {number} y - Y Position
     * @param {number} w - Width
     * @param {number} h - Height
     * @param {function(){}} ontrigger - What to do when player enters the zone
     */
    constructor(x=0,y=0,w=0,h=0,ontrigger=function(){})
    {
        super(x,y,w,h,"trigger")
        this.ontrigger = ontrigger
    }
}
class EDoor extends EObjectClass
{
    /**
     * This is a Door function. If the player presses up, he executes `onpress`
     * @param {number} x - X Position
     * @param {number} y - Y Position
     * @param {number} w - Width
     * @param {number} h - Height
     * @param {function(){}} onpress - What to do if player presses up
     */
    constructor(x=0,y=0,w=0,h=0,onpress=function(){})
    {
        super(x,y,w,h,"door")
        this.onpress = onpress
    }
}
class ETileset
{
    /**
     * A Tileset to contruct the levels floor, ceiling and walls
     * @param {number} w - Width of one tile 
     * @param {number} h - Height of one tile
     * @param {string} tilesheet - Path to the tilesheet
     */
    constructor(w=16,h=16,tilesheet="./textures/tilesheet.png")
    {
        /**
         * The width of one single tile
         */
        this.w = w
        /**
         * The height of one single tile
         */
        this.h = h
        /**
         * The path to the tilesheet
         */
        this.tilesheet = tilesheet
        this._image = new Image()
        this._image.src = this.tilesheet
        /**
         * All the possible tiles this tilesheets has. You need to add them yourself with `setTile`
         */
        this.tiles = []
        this._ctx = render.ctx
    }
    /**
     * Adds a new tile to the tilesheet
     * @param {number} x - X Position in the tilesheet
     * @param {number} y - Y Position in the tilesheet
     */
    setTile(x=0,y=0)
    {
        this.tiles.push({x:x,y:y,w:this.w,h:this.h})
    }
    /**
     * Turns the tile in the `tiles` array to a EObject
     * @param {number} index - The Index in the array 
     * @param {number} x - X Position
     * @param {number} y - Y Position
     */
    toEObject(index=0,x=0,y=0)
    {
        const tile = this.tiles[index]
        const eobject = new EObject(x,y,tile.w,tile.h,"object",this.tilesheet)
        eobject.AddAnimation(tile.x,tile.y,tile.w,tile.h)
        eobject.SetAnimation(1)
        return eobject
    }
}
/**
 * This is a collision test for two objects. It musn't be a `EObjectClass` but it needs X, Y, Width and Height as a property
 * @param {EObjectClass} obj1 - The one Object
 * @param {EObjectClass} obj2 - The other Object
 */
function collision(obj1=new EObjectClass(),obj2=new EObjectClass())
{
    const right = (obj1.x+obj1.w)>=(obj2.x)
    const left = (obj2.x+obj2.w)>=(obj1.x)
    const bottom = (obj1.y+obj1.h)>=(obj2.y)
    const top = (obj2.y+obj2.h)>=(obj1.y)
    return {top:top,left:left,bottom:bottom,right:right}
}
const globals = {
    Gacc:0.046875,
    Gdec:0.5,
    Gfrc:0.046875,
    Gtop:6,
    Gslp:0.125,
    Gslpru:0.078125,
    Gslprd:0.3125,
    Gair:0.09375,
    Gjump:6.5,
    Ggrv:0.21875
}
module.exports =
{
    class:EObjectClass,
    temp:EObjectTEMP,
    main:EObject,
    player:EObjectPlayer,
    playertemp:EObjectPlayerTEMP,
    door:EDoor,
    trigger:ETrigger,
    tileset:ETileset,
    collision:collision,
    globals:globals
}