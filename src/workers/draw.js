const util = require("./../utils")
const render = require("./../render")
const options = require("./../../options.json")
const { gl } = require("./../render")

function HardwareDraw(programInfo=render.glProgramInfo,buffers=render.InitBuffers())
{
    const FOV = 45*Math.PI/180
    const Aspect = render.canvas.clientWidth/render.canvas.clientHeight
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
}
function SoftwareDraw()
{
    
}
function Tick()
{
    render.clear(options.hardware)
    if(options.hardware)
    {
        
    }
    
}
module.exports =
{
    tick:Tick
}
