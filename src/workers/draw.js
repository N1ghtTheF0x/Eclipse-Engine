const util = require("./../utils")
const render = require("./../render")
const options = require("./../options")
const eobjectM = require("./../objects")
const game = require("./../game")
const EOptions = require("./../options")

function HardwareDraw(Render=new render.render(),objects=[new eobjectM.main()])
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
        const program = Render.GetShaderProgram("./../shaders/image_vertex.glsl","./../shaders/image_fragment.glsl")
        if(program!==null)
        {
            const PosAttribute = Render.gl.getAttribLocation(program,"pos")
            const TexAttribute = Render.gl.getAttribLocation(program,"texpos")

            const PosBuffer = Render.gl.createBuffer()
            const TexBuffer = Render.gl.createBuffer()

            Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER,PosBuffer)
            SetRectangle(eobject.x,eobject.y,eobject._w,eobject._h)

            Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER,TexBuffer)
            Render.gl.bufferData(Render.gl.ARRAY_BUFFER,new Float32Array([
                0.0,0.0,
                1.0,0.0,
                0.0,1.0,
                0.0,1.0,
                1.0,0.0,
                1.0,1.0
            ]),Render.gl.STATIC_DRAW)

            const texture = Render.gl.createTexture()
            Render.gl.bindTexture(Render.gl.TEXTURE_2D,texture)

            Render.gl.texParameteri(Render.gl.TEXTURE_2D,Render.gl.TEXTURE_WRAP_S,Render.gl.CLAMP_TO_EDGE)
            Render.gl.texParameteri(Render.gl.TEXTURE_2D,Render.gl.TEXTURE_WRAP_T,Render.gl.CLAMP_TO_EDGE)
            Render.gl.texParameteri(Render.gl.TEXTURE_2D,Render.gl.TEXTURE_MIN_FILTER,Render.gl.NEAREST)
            Render.gl.texParameteri(Render.gl.TEXTURE_2D,Render.gl.TEXTURE_MAG_FILTER,Render.gl.NEAREST)

            Render.gl.texImage2D(Render.gl.TEXTURE_2D,0,Render.gl.RGBA,Render.gl.RGBA,Render.gl.UNSIGNED_BYTE,eobject._image)

            Render.SetResolution(Render.window.screen.width,Render.window.screen.height)

            Render.gl.viewport(0,0,Render.canvas.width,Render.canvas.height)

            Render.gl.useProgram(program)

            Render.gl.enableVertexAttribArray(PosAttribute)
            Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER,PosBuffer)
            Render.gl.vertexAttribPointer(PosAttribute,2,Render.gl.FLOAT,false,0,0)

            Render.gl.enableVertexAttribArray(TexAttribute)
            Render.gl.bindBuffer(Render.gl.ARRAY_BUFFER,TexBuffer)
            Render.gl.vertexAttribPointer(TexAttribute,2,Render.gl.FLOAT,false,0,0)

            Render.gl.uniform2f(ResLoc,Render.canvas.width,Render.canvas.height)
            Render.gl.drawArrays(Render.gl.TRIANGLES,0,6)
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
                    if(object.x>(-20-object.w)||object.x<(Render.canvas.width+object.w))
                    {
                        RenderEObject(object)
                    }
                }
            }
        }
    }
}
function SoftwareDraw(Render=new render.render(),objects=[new eobjectM.main(),new eobjectM.temp(),new eobjectM.class(),new eobjectM.player(),new eobjectM.playertemp()])
{
    if(objects instanceof Array)
    {
        for(const object of objects)
        {
            if(object)
            {
                if(object.x>(-20-object.w)||object.x<(Render.canvas.width+object.w))
                {
                    if(object.color)
                    {
                        Render.ctx.fillStyle = object.color
                        Render.ctx.fillRect(object.x,object.y,object._w,object._h)
                    }
                    if(object._image)
                    {
                        object._ctx.clearRect(0,0,object.w,object.h)
                        object._ctx.drawImage(object._image,object.sx,object.sy,object.sw,object.sh,0,0,object._w,object._h)
                        object._ctx.scale(object.z,object.z)
                        Render.ctx.drawImage(object._canvas,0,0,object._w,object._h,object.x*Render.factor,object.y*Render.factor,object._w*Render.factor,object._h*Render.factor)
                    }
                }
            }
        }
    }
}
function Tick(Render=new render.render(),objects)
{
    Render.Clear(game.main.options.hardware)
    if(game.main.options.hardware)
    {
        if(Render.gl!==null)
        {
            HardwareDraw(Render,objects)
        }
    }
    else
    {
        if(Render.ctx!==null)
        {
            SoftwareDraw(Render,objects)
        }
    }
    
}
module.exports = Tick