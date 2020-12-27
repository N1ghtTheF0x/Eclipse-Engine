const ERender = require("./../render")
const eobjectM = require("./../objects")
const ewidgets = require("./../widget")
const EGame = require("./../game")
const utils = require("../utils")

function HardwareDraw(Render=new ERender(),objects=[new eobjectM.main()])
{
    function RenderEObject(eobject=new eobjectM.main())
    {
        function SetRectangle(x=0,y=0,width=0,height=0)
        {
            const x1 = x
            const x2 = x+width
            
            const y1 = y
            const y2 = y+height
            Render.gl.bufferData(Render.gl.ARRAY_BUFFER,new Float32Array([
                x1,y1,
                x2,y1,
                x1,y2,
                x1,y2,
                x2,y1,
                x2,y2
            ]),Render.gl.STATIC_DRAW)
        }
        const program = Render.GetShaderProgram("./src/shaders/image_vertex.glsl","./src/shaders/image_fragment.glsl")
        if(program!==null)
        {
            const PosAttribute = Render.gl.getAttribLocation(program,"a_position")
            const TexAttribute = Render.gl.getAttribLocation(program,"a_texCoord")

            const ResLoc = Render.gl.getUniformLocation(program,"u_resolution")
            const ImageLoc = Render.gl.getUniformLocation(program,"u_image")
            const TranslationLoc = Render.gl.getUniformLocation(program,"u_translation")
            const RotationLoc = Render.gl.getUniformLocation(program,"u_rotation")

            const vao = Render.gl.createVertexArray()

            Render.gl.bindVertexArray(vao)

            const PosBuffer = Render.gl.createBuffer()

            Render.gl.enableVertexAttribArray(PosAttribute)

            Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER,PosBuffer)
            
            Render.gl.vertexAttribPointer(PosAttribute,2,Render.gl.FLOAT,false,0,0)

            const TexBuffer = Render.gl.createBuffer()

            Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER,TexBuffer)
            Render.gl.bufferData(Render.gl.ARRAY_BUFFER,new Float32Array([
                0.0,0.0,
                1.0,0.0,
                0.0,1.0,
                0.0,1.0,
                1.0,0.0,
                1.0,1.0
            ]),Render.gl.STATIC_DRAW)

            Render.gl.enableVertexAttribArray(TexAttribute)

            Render.gl.vertexAttribPointer(TexAttribute,2,Render.gl.FLOAT,false,0,0)

            const texture = Render.gl.createTexture()
            Render.gl.activeTexture(Render.gl.TEXTURE0)
            Render.gl.bindTexture(Render.gl.TEXTURE_2D,texture)

            Render.gl.texParameteri(Render.gl.TEXTURE_2D,Render.gl.TEXTURE_WRAP_S,Render.gl.CLAMP_TO_EDGE)
            Render.gl.texParameteri(Render.gl.TEXTURE_2D,Render.gl.TEXTURE_WRAP_T,Render.gl.CLAMP_TO_EDGE)
            Render.gl.texParameteri(Render.gl.TEXTURE_2D,Render.gl.TEXTURE_MIN_FILTER,Render.gl.NEAREST)
            Render.gl.texParameteri(Render.gl.TEXTURE_2D,Render.gl.TEXTURE_MAG_FILTER,Render.gl.NEAREST)

            Render.gl.texImage2D(Render.gl.TEXTURE_2D,0,Render.gl.RGBA,Render.gl.RGBA,Render.gl.UNSIGNED_BYTE,eobject._image)

            Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER,PosBuffer)

            SetRectangle(eobject.x,eobject.y,eobject._w,eobject._h)

            Render.SetResolution(screen.width,screen.height)

            Render.gl.viewport(0,0,Render.canvasGL.width,Render.canvasGL.height)

            Render.gl.useProgram(program)

            Render.gl.bindVertexArray(vao)

            Render.gl.uniform2f(ResLoc,Render.canvasGL.width,Render.canvasGL.height)

            Render.gl.uniform1i(ImageLoc,0)

            Render.gl.uniform2fv(TranslationLoc,eobject.translation)

            Render.gl.uniform2fv(RotationLoc,eobject.rotation)

            Render.gl.drawArrays(Render.gl.TRIANGLES,0,6)

            Render.gl.deleteTexture(texture)
            Render.gl.deleteProgram(program)
            Render.gl.deleteVertexArray(vao)

            Render.gl.deleteBuffer(PosBuffer)
            Render.gl.deleteBuffer(TexBuffer)
        }
    }
    if(objects instanceof Array)
    {
        for(const object of objects)
        {
            if(object)
            {
                if(object._image)
                {
                    if(object.x>(-20-object.w)||object.x<(Render.canvasGL.width+object.w))
                    {
                        RenderEObject(object)
                    }
                }
            }
        }
    }
}
function SoftwareDraw(Render=new ERender(),objects=[new eobjectM.main(),new ewidgets.button()])
{
    function RenderEObject(object=objects[0])
    {
        if(object)
        {
            try
            {
                if(object instanceof eobjectM.main)
                {
                    object._ctx.drawImage(object._image,object.sx,object.sy,object.sw,object.sh,0,0,object.sw,object.sh)
                    Render.ctx.drawImage(object._canvas,0,0,object.sw,object.sh,object.x*Render.factor,object.y*Render.factor,object.w*Render.factor,object.h*Render.factor)
                    Render.ctx.fillStyle=utils.RGBA(0,0,255,0.5)
                    Render.ctx.fillRect(object.x*Render.factor,object.y*Render.factor,object.w*Render.factor,object.h*Render.factor)
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
    Render.ctx.fillStyle="black"
    Render.ctx.fillRect(Render.input.cursor.x,Render.input.cursor.y,2*Render.factor,2*Render.factor)
}
function Tick(Game=new EGame(),objects=[new eobjectM.main()])
{
    Game.hooks.beforedrawclear(Game)
    Game.render.Clear()
    Game.hooks.beforedraw(Game)
    if(Game.render.gl&&Game.render.gl!==null&&Game.hardware)
    {
        HardwareDraw(Render,objects)
    }
    else if(Game.render.ctx&&Game.render.ctx!==null&&!Game.hardware)
    {
        Game.render.SetResolution(window.innerWidth,window.innerHeight)
        SoftwareDraw(Render,objects)
    }
    Game.hooks.afterdraw(Game)
}
module.exports = Tick