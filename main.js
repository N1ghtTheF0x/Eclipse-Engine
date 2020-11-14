const util = require("./src/utils")
const render = require("./src/render")
const mainWorker = require("./src/workers/main").main
const escreen = require("./src/screen")
util.print("info","Starting game...")
util.print("info","Creating Window...")
if(document.getElementById("Game"))
{
    document.getElementById("Game").append(render.canvas)
}
escreen.SwitchToEScreen("dummy",0)
mainWorker(0)