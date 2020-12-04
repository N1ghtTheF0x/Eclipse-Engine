const util = require("./../utils")
const render = require("./../render")
const options = require("./../options")
const eobjectM = require("./../objects")
const ewidgets = require("./../widget")
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
function SoftwareDraw(Render=new render.render(),objects=[new eobjectM.main(),new ewidgets.button()])
{
    function RenderEObject(object=objects[0])
    {
        if((object)&&(object._image))
        {
            if((object instanceof eobjectM.main)&&(object._canvas.width!==0&&object._canvas.height!==0))
            {
                object._ctx.clearRect(0,0,object.w,object.h)
                object._ctx.drawImage(object._image,object.sx,object.sy,object.sw,object.sh,0,0,object._w,object._h)
                Render.ctx.drawImage(object._canvas,0,0,object._w,object._h,object.x*Render.factor,object.y*Render.factor,object._w*Render.factor,object._h*Render.factor)
            }
            if(object instanceof ewidgets.button)
            {
                Render.ctx.drawImage(object._image,0,0,object._w,object._h,object.x*Render.factor,object.y*Render.factor,object._w*Render.factor,object._h*Render.factor)
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
function Tick(Render=new render.render(),objects=[new eobjectM.main()])
{
    Render.Clear()
    if(Render.gl&&Render.gl!==null&&game.main.options.hardware)
    {
        HardwareDraw(Render,objects)
    }
    else if(Render.ctx&&Render.ctx!==null&&!game.main.options.hardware)
    {
        SoftwareDraw(Render,objects)
    }
}
module.exports = Tick