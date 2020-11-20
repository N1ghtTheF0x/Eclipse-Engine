const util = require("./../utils")
const render = require("./../render")
const options = require("./../../options.json")
const eobjectM = require("./../objects")

/*function HardwareDraw(Render=new render.render(),programInfo=Render.glProgramInfo,buffers=Render.InitBuffers())
{
    const FOV = 45*Math.PI/180
    const Aspect = Render.canvas.clientWidth/render.canvas.clientHeight
    const zNear = 0.1
    const zFar = 100.0
    const projectionMatrix = render.matrix.mat4.create()
    render.matrix.mat4.perspective(projectionMatrix,FOV,Aspect,zNear,zFar)
    const modelViewMatrix = render.matrix.mat4.create()
    render.matrix.mat4.translate(modelViewMatrix,modelViewMatrix,[])
    {
        const numC = 2
        const type = render.gl.FLOAT
        const normalize = false
        const stride = 0
        const offset = 0
        render.gl.bindBuffer(render.gl.ARRAY_BUFFER,buffers)
        render.gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition,numC,type,normalize,stride,offset)
        render.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
    }
    render.gl.useProgram(programInfo.program)
    render.gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix,false,projectionMatrix)
    render.gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix,false,modelViewMatrix)
    {
        const offset = 0
        const vertexCount = 4
        gl.drawArrays(gl.TRIANGLE_STRIP,offset,vertexCount)
    }
}*/
function SoftwareDraw(Render=new render.render(),objects=[new eobjectM.main(),new eobjectM.temp()])
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
                        Render.ctx.fillRect(object.x,object.y,object.w,object.h)
                    }
                    if(object._image)
                    {
                        object._ctx.clearRect(0,0,object.w,object.h)
                        object._ctx.drawImage(object._image,object.sx,object.sy,object.sw,object.sh,0,0,object.w,object.h)
                        Render.ctx.drawImage(object._canvas,0,0,object.w,object.h,object.x,object.y,object.w,object.h)
                    }
                }
            }
        }
    }
}
function Tick(Render=new render.render(),objects)
{
    Render.Clear(options.hardware)
    if(options.hardware)
    {
        //HardwareDraw()
    }
    else
    {
        SoftwareDraw(Render,objects)
    }
    
}
module.exports = Tick