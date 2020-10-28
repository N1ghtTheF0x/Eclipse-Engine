const fs = require("fs")
const matrix = require("gl-matrix")
const utils = require("./utils")
/**
 * The Main Canvas. Everything is here.
 */
const canvas = document.createElement("canvas")
/**
 * This Faktor is used to calculate the "real" canvas width and height
 */
var drawFaktor = (window.screen.height/200)
canvas.height = 200*drawFaktor
canvas.width = 320*drawFaktor
/**
 * Software Render Context
 */
const ctx = canvas.getContext("2d")
// This removes the blur effect
ctx.imageSmoothingEnabled=false
/**
 * Hardware Render Context
 */
const gl = canvas.getContext("webgl2")
function Clear(hardware=false)
{
    if(hardware)
    {
        gl.clearColor(0,0,0,0)
        gl.clearDepth(1.0)
        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LEQUAL)
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    }
    else
    {
        ctx.clearRect(0,0,canvas.width,canvas.height)
    }
}
/**
 * Returns a compiled shader if successful
 * @param {number} type - The type of shader: Fragment or Vertex
 * @param {string} path - Path to the Shader's source file
 */
function GetShader(type=gl.VERTEX_SHADER,path="")
{
    const shader = gl.createShader(type)
    gl.shaderSource(shader,fs.readFileSync(path,{encoding:"utf-8"}))
    gl.compileShader(shader)
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
    {
        utils.print("error","Shader compiling failed with "+path+":\n\n"+gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}
/**
 * Returns the Shader Program of one Vertex and Fragment Shader
 * @param {string} vertexPath - Path to the Vertex Shader's source file
 * @param {string} fragmentPath - Path to the Fragment Shader's source file
 */
function GetShaderProgram(vertexPath="",fragmentPath="")
{
    const Vs = GetShader(gl.VERTEX_SHADER,vertexPath)
    const Fs = GetShader(gl.FRAGMENT_SHADER,fragmentPath)
    const shaderprogram = gl.createProgram()
    gl.attachShader(shaderprogram,Vs)
    gl.attachShader(shaderprogram,Fs)
    gl.linkProgram(shaderprogram)
    if(!gl.getProgramParameter(shaderprogram,gl.LINK_STATUS))
    {
        utils.print("error","Shader Program not initialized:\n\n"+gl.getProgramInfoLog(shaderprogram))
        return null
    }
    return shaderprogram
}
function InitBuffers(positions=[-1.0,1.0])
{
    const pB = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,pB)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW)
    return pB
}
const ProgramInfo =
{
    program:undefined||new WebGLProgram(),
    attribLocations:
    {
        vertexPosition:undefined
    },
    uniformLocations:
    {
        projectionMatrix:undefined,
        modelViewMatrix:undefined
    }
}
function FramesPerSecondCalc(time=0)
{
    const passed=(time-game.oldtime)/1000
    const oldtime=time
    const fps=Math.round(1/game.passed)
    if(document.getElementById("dfps"))
    {
        document.getElementById("dfps").innerHTML = fps
    }
}
/**
 * Here you can find all important variables to Rendering
 */
module.exports =
{
    canvas:canvas,
    drawFaktor:drawFaktor,
    ctx:ctx,
    gl:gl,
    clear:Clear,
    glProgramInfo:ProgramInfo,
    matrix:matrix,
    GetShader:GetShader,
    GetShaderProgram:GetShaderProgram,
    InitBuffers:InitBuffers,
    fpsc:FramesPerSecondCalc
}