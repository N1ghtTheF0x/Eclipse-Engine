const _console = require("console").Console
const path = require("path")
const fs = require("fs")
const latestlogfile = fs.createWriteStream(path.resolve(process.resourcesPath,"latest.log"))
const fileconsole = new _console(latestlogfile,latestlogfile)
const console = new _console(process.stdout,process.stderr)
/**
 * A sleep function to pause | returns a promise
 * @param {number} ms 
 */
function sleep(ms=1000)
{
    return new Promise(function(resolve=function(ms)
    {

    })
    {
        setTimeout(resolve,ms)
    })
}
/**
 * A better and pretty print function. It shows when the print function got executed with an type like WARN, DEBUG, INFO, ERROR
 * @param {"info"|"error"|"log"|"debug"|"warn"|"dir"} type - The type of the log message. It autocaps the text
 * @param {string} message - What's the message to print to the console?
 */
function print(type="WARN",message="Default print text!")
{
    const d = new Date()
    const h = d.getHours()
    const m = d.getMinutes()
    const s = d.getSeconds()
    function CalcZero(time=0)
    {
        if(time<10)
        {
            return "0"+time
        }
        return time
    }
    const TYPE = type.toUpperCase()
    const time = "["+CalcZero(h)+":"+CalcZero(m)+":"+CalcZero(s)+"]"
    const result = time+" - "+TYPE+" - "+message
    if(console[type.toLowerCase()])
    {
        console[type.toLowerCase()](result)
        fileconsole[type.toLowerCase()](result)
    }
}
/**
 * Fast way to print debug stuff
 * @param {string} message 
 */
function Dprint(message="")
{
    print("debug",message)
}
/**
 * A Random Number Generator with Range
 * @param {number} min - the minimum possible number
 * @param {number} max - the max possible number
 */
function RandomNumber(min=0,max=1)
{
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random()*(max-min)+min)
}
/**
 * A RGB function, what's more to say?
 * @param {number} red - RED 0...255
 * @param {number} green - GREEEN 0...255
 * @param {number} blue - BLUE 0...255
 */
function RGB(red=0,green=0,blue=0)
{
    return "rgb("+red+","+green+","+blue+")"
}
/**
 * Same as RGB but with Alpha
 * @param {number} red - RED 0...255
 * @param {number} green - GREEN 0...255
 * @param {number} blue - BLUE 0...255
 * @param {number} alpha - ALPHA 0...1 | decimals values are possible, just between 0 and 1
 */
function RGBA(red=0,green=0,blue=0,alpha=0)
{
    return "rgba("+red+","+green+","+blue+","+alpha+")"
}
/** 
 * Return a boolean if the number is negative
 * @param {number} num - Is this number negative?
 */
function IsNumberNegative(num=0)
{
    const sign = Math.sign

    if(sign(num)===1)
    {
        return false
    }
    else if(sign(num)===-1)
    {
        return true
    }
    else if(sign(0)===0)
    {
        return false
    }
    return false
}
module.exports = 
{
    sleep:sleep,
    print:print,
    Dprint:Dprint,
    RandomNumber:RandomNumber,
    RGB:RGB,
    RGBA:RGBA,
    IsNumberNegative:IsNumberNegative
}