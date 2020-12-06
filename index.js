const util = require("./src/utils")
const render = require("./src/render")
const mainWorker = require("./src/workers/main").main
const escreen = require("./src/screen")
const game = require("./src/game")
const fs = require("fs")
const electron = require("electron").remote
const path = require("path")
util.print("info","Starting game...")
util.print("info","Creating Render...")
const Render = new render.render(window)
util.print("info","Creating Window...")
Render.Init()
game.renderUpdate(Render)
util.print("info","Start Input")
Render.input.Init(Render.input)
const PATH = path.resolve("./src/game/init")
if(fs.existsSync(PATH))
{
    util.print("info","Executing Game Init Script...")
    require(PATH)(Render)
}
else
{
    util.print("warn","Init Script not found!\nPath provided is: "+PATH)
    electron.dialog.showMessageBoxSync(null,{title:"No Init Script!",message:"There's no Init Script in the Game folder!",detail:"Contact the Developer!",type:"warning",buttons:["Ok"]})
    escreen.SwitchToEScreen("dummy",0)
}
mainWorker(Render)