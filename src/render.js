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
        gl.clear(gl.COLOR_CLEAR_VALUE)
    }
    else
    {
        ctx.clearRect(0,0,canvas.width,canvas.height)
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
    gl:gl
}