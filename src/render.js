const fs = require("fs")
const matrix = require("gl-matrix")
const utils = require("./utils")
const input = require("./input")

class ERender
{
    constructor(WINDOW=window)
    {
        this.window = WINDOW
        this.canvas = this.window.document.createElement("canvas")
        this.input = new input(this.window)
        this.FPS =
        {
            passed:0,
            old:0
        }
        this.canvas.height = this.window.screen.height
        this.canvas.width = this.window.screen.width
        this.ctx = this.canvas.getContext("2d")
        this.ctx.imageSmoothingEnabled=false
        this.gl = this.canvas.getContext("webgl2")
        this.ProgramInfo =
        {
            program:undefined,
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
    }
    Clear(hardware=false)
    {
        if(hardware)
        {
            this.gl.clearColor(0,0,0,0)
            this.gl.clearDepth(1.0)
            this.gl.enable(this.gl.DEPTH_TEST)
            this.gl.depthFunc(this.gl.LEQUAL)
            this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)
        }
        else
        {
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        }
    }
    /**
    * Returns a compiled shader if successful
    * @param {number} type - The type of shader: Fragment or Vertex
    * @param {string} path - Path to the Shader's source file
    */
    GetShader(type=this.gl.VERTEX_SHADER,path="")
    {
        const shader = this.gl.createShader(type)
        this.gl.shaderSource(shader,fs.readFileSync(path,{encoding:"utf-8"}))
        this.gl.compileShader(shader)
        if(!this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS))
        {
            utils.print("error","Shader compiling failed with "+path+":\n\n"+this.gl.getShaderInfoLog(shader))
            this.gl.deleteShader(shader)
            return null
        }
        return shader
    }
    /**
    * Returns the Shader Program of one Vertex and Fragment Shader
    * @param {string} vertexPath - Path to the Vertex Shader's source file
    * @param {string} fragmentPath - Path to the Fragment Shader's source file
    */
    GetShaderProgram(vertexPath="",fragmentPath="")
    {
        const Vs = GetShader(this.gl.VERTEX_SHADER,vertexPath)
        const Fs = GetShader(this.gl.FRAGMENT_SHADER,fragmentPath)
        const shaderprogram = this.gl.createProgram()
        this.gl.attachShader(shaderprogram,Vs)
        this.gl.attachShader(shaderprogram,Fs)
        this.gl.linkProgram(shaderprogram)
        if(!this.gl.getProgramParameter(shaderprogram,this.gl.LINK_STATUS))
        {
            utils.print("error","Shader Program not initialized:\n\n"+this.gl.getProgramInfoLog(shaderprogram))
            return null
        }
        return shaderprogram
    }
    GetBuffers(positions=[-1.0,1.0])
    {
        const pB = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,pB)
        this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(positions),this.gl.STATIC_DRAW)
        return pB
    }
    
}
function FramesPerSecondCalc(Render=new ERender(),time=0)
{
    Render.FPS.passed=(time-Render.FPS.old)/1000
    Render.FPS.old=time
    const fps=Math.round(1/Render.FPS.passed)
    return fps
}
/**
 * Here you can find all important variables to Rendering
 */
module.exports =
{
    render:ERender,
    FPSC:FramesPerSecondCalc
}