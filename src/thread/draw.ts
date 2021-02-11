import {ERender} from "../render"
import { EObjects } from "../objects"
import {EGame} from "../game"
import {EUtils} from "../utils"
import {EScreens} from "../screen"

const utils: EUtils = new EUtils("thread/draw.ts")

/**
 * Renders all EObjects in Hardware (WebGL)
 * @param {EGame} Game - The Main Game Object. Used to get the `ERender`
 * @param {EObject[]} objects - The list of `EObjects` to Render
 */
function HardwareDraw(Game: EGame,layer: EScreens.ELayer)
{
    
}
/**
 * Renders all EObjects in Software (2D-Context)
 * @param {EGame} Game - The Main Game Object. Used to get the `ERender` 
 * @param {EObject[]} objects - The list of `EObjects` to render
 */
function SoftwareDraw(Game: EGame,layer: EScreens.ELayer)
{
    const objects = layer.objects
    const Render = Game.render
    function RenderEObject(object: EObjects.EObjectAny)
    {
        if(object)
        {
            try
            {
                if(object instanceof EObjects.EObject)
                {
                    object._ctx.drawImage(object._image,object.sx,object.sy,object.sw,object.sh,0,0,object.sw,object.sh)
                    Render.ctx.drawImage(object._canvas,0,0,object.sw,object.sh,object.x*Render.factor,object.y*Render.factor,object.w*Render.factor*object.scale,object.h*Render.factor*object.scale)
                    if(Game.DEBUG.drawhitbox)
                    {
                        Render.ctx.fillStyle=utils.RGBA(0,0,255,0.5)
                        Render.ctx.fillRect(object.x*Render.factor,object.y*Render.factor,object.w*Render.factor,object.h*Render.factor)
                    }
                }     
            }
            catch(e)
            {
                utils.print("error","Error At Software Render:\n\n"+e)
            }
        }
    }
    if(objects instanceof Array)
    {
        for(const object of objects)
        {
            if(object.x>(-20-object.w)||object.x<(Render.canvasCTX.width+object.w))
            {
                RenderEObject(object)
            }
        }
    }
}
/**
 * One Tick. Should be in a Loop or something
 * @param {EGame} Game - The Main Game Object
 */
export function DrawTick(Game: EGame)
{
    const layers = Game.current.layers
    for(const layer of layers)
    {
        Game.hooks.beforedrawclear(Game)
        Game.render.Clear()
        Game.hooks.beforedraw(Game)
        if(Game.render.hasGL&&Game.hardware)
        {
            HardwareDraw(Game,layer)
        }
        else if(Game.render.hasCTX&&!Game.hardware)
        {
            Game.render.SetResolution(window.innerWidth,window.innerHeight)
            SoftwareDraw(Game,layer)
        }
        Game.hooks.afterdraw(Game)
    }
    
}
