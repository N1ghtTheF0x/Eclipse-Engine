const fs = require("fs")
const matrix = require("gl-matrix")
const utils = require("./utils")
const input = require("./input")
const escreen = require("./screen")
const eobjects = require("./objects")
const eaudio = require("./audio")
const debug = require("./debug")
const remote = require("electron").remote

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
         * The main canvas. Everything is rendered on this
         */
        this.canvas = this.window.document.createElement("canvas")
        this.canvas.height = this.window.screen.height
        this.canvas.width = this.window.screen.width
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
         * EDebug Access
         */
        this.debug = debug
        /**
         * Electron Dialog Access
         */
        this.dialog = remote.dialog
        this.utils = utils
        
        /**
         * The Draw factor. This is used to show objects in the same position when you set the resolution lower than your monitor's one
         */
        this.factor = 1
        /**
         * The Hardware Context. GPU driven.
         */
        this.gl = this.canvas.getContext("webgl2")
        if(this.gl===null)
        {
            utils.print("warn","WebGL Render is not available!")
            remote.dialog.showErrorBox("Render Error!","Your PC does not support WebGL2!")
            remote.process.exit(1)
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
                this.canvas.height = height
                this.canvas.width = width
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
        return {width:this.canvas.width,height:this.canvas.height}
    }
    /**
     * Clears the canvas
     * @param {boolean} hardware - Should we use Hardware for clearing the screen?
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
