const fs = require("fs")
const matrix = require("gl-matrix")
const utils = require("./utils")
const input = require("./input")
const escreen = require("./screen")
const eobjects = require("./objects")
const eaudio = require("./audio")
const debug = require("./debug")
const remote = require("electron").remote
const ewigets = require("./widget")

class ERender
{
    /**
     * This is the main Render. Here are all things related to your screen and drawn objects. The Input is also present here for Keyboard/Mouse/Gamepad detection
     * @param {window} WINDOW - The window variable which contains **E V E R Y T H I N G**
     */
    constructor(WINDOW=window)
    {
        /**
         * need a reference for canvas-creation and input
         */
        this.window = WINDOW
        /**
         * Render's personal input class
         */
        this.input = new input(this.window)
        /**
         * **F**rames **P**er **S**econd shows how many frames are rendered in seconds. This is used to calculate the FPS
         */
        this.FPS =
        {
            passed:0,
            old:0
        }
        /**
         * The Hardware canvas. Hardware rendering is found here
         */
        this.canvasGL = this.window.document.createElement("canvas")
        /**
         * The Software canvas. Software rendering is found here
         */
        this.canvasCTX = this.window.document.createElement("canvas")
        this.canvasGL.height = this.window.screen.height
        this.canvasGL.width = this.window.screen.width
        this.canvasCTX.height = this.window.screen.height
        this.canvasCTX.width = this.window.screen.width
        /**
         * EScreen Access
         */
        this.escreens = escreen
        /**
         * EObjects Access
         */
        this.eobjects = eobjects
        /**
         * EAudio Access
         */
        this.eaudio = eaudio
        /**
         * EWidgets Access
         */
        this.ewigets = ewigets
        /**
         * EDebug Access
         */
        this.debug = debug
        /**
         * Electron Dialog Access
         */
        this.dialog = remote.dialog
        /**
         * Utilities Access
         */
        this.utils = utils
        /**
         * The Draw factor. This is used to show objects in the same position when you set the resolution lower than your monitor's one
         */
        this.factor = 1
        this.currentObjects = [new this.eobjects.main()]
        /**
         * The Hardware Context. GPU driven.
         */
        this.gl = this.canvasGL.getContext("webgl2")
        if(this.gl===null)
        {
            utils.print("warn","Hardware Render is not available!")
        }
        else
        {

        }
        this.ctx = this.canvasCTX.getContext("2d")
        if(this.ctx===null)
        {
            utils.print("warn","Software Render is not available!")
        }
    }
    /**
     * Set the canvas's resolution. **0 cannot be used as a parameter!**
     * @param {number} width - Width of the new canvas
     * @param {number} height - Height of the new canvas
     */
    SetResolution(width=1920,height=1080)
    {
        if(width!==0)
        {
            if(height!==0)
            {
                this.canvasGL.height = height
                this.canvasGL.width = width
                this.canvasCTX.height = height
                this.canvasCTX.width = width
                this.factor = width/this.window.screen.width
            }
            else
            {
                utils.print("warn","Height cannot be 0!")
            }
        }
        else
        {
            utils.print("warn","Width cannot be 0!")
        }
    }
    GetResolution()
    {
        return {width:this.canvasGL.width,height:this.canvasGL.height}
    }
    /**
     * Clears the canvas
     */
    Clear()
    {
        if(this.gl&&this.gl!==null)
        {
            this.gl.clearColor(0,0,0,0)
            this.gl.clearDepth(1.0)
            this.gl.enable(this.gl.DEPTH_TEST)
            this.gl.depthFunc(this.gl.LEQUAL)
            this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)
        }
        if(this.ctx&&this.ctx!==null)
        {
            this.ctx.clearRect(0,0,this.canvasCTX.width,this.canvasCTX.height)
        }
    }
    /**
    * Returns a compiled shader if successful
    * @param {number} type - The type of shader: Fragment or Vertex
    * @param {string} path - Path to the Shader's source file
    */
    GetShader(type=this.gl.VERTEX_SHADER,path="")
    {
        if(this.gl&&this.gl!==null)
        {
            const shader = this.gl.createShader(type)
            if(shader instanceof WebGLShader)
            {
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
            else
            {
                return null
            }
        }
        else
        {
            return null
        }
    }
    /**
    * Returns the Shader Program of one Vertex and Fragment Shader
    * @param {string} vertexPath - Path to the Vertex Shader's source file
    * @param {string} fragmentPath - Path to the Fragment Shader's source file
    */
    GetShaderProgram(vertexPath="",fragmentPath="")
    {
        if(this.gl&&this.gl!==null)
        {
            const Vs = this.GetShader(this.gl.VERTEX_SHADER,vertexPath)
            const Fs = this.GetShader(this.gl.FRAGMENT_SHADER,fragmentPath)
            if(Vs instanceof WebGLShader&&Fs instanceof WebGLShader)
            {
                const shaderprogram = this.gl.createProgram()
                this.gl.attachShader(shaderprogram,Vs)
                this.gl.attachShader(shaderprogram,Fs)
                this.gl.linkProgram(shaderprogram)
                if(!this.gl.getProgramParameter(shaderprogram,this.gl.LINK_STATUS))
                {
                    utils.print("error","Shader Program not initialized:\n\n"+this.gl.getProgramInfoLog(shaderprogram))
                    this.gl.deleteProgram(shaderprogram)
                    return null
                }
                return shaderprogram  
            }
            else
            {
                return null
            }
        }
        else
        {
            return null
        }
    }
    Init()
    {
        if(document.getElementById("Game"))
        {
            document.getElementById("Game").append(this.canvasGL)
            document.getElementById("Game").append(this.canvasCTX)
            return true
        }
        else
        {
            return false
        }
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
