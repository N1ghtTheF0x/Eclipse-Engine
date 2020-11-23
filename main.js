const render = require("./src/render")
function Init(Render=new render.render)
{
    const util = require("./src/utils")
    const mainWorker = require("./src/workers/main").main
    const escreen = require("./src/screen")
    const game = require("./src/game")
    const fs = require("fs")
    const electron = require("electron").remote
    util.print("info","Starting game...")
    util.print("info","Creating Render...")
    util.print("info","Creating Window...")
    if(document.getElementById("Game"))
    {
        document.getElementById("Game").append(Render.canvas)
    }
    game.renderUpdate(Render)
    util.print("info","Start Input")
    Render.input.Init(Render.input)
    if(fs.existsSync("./src/game/init.js"))
    {
        util.print("info","Executing Game Init Script...")
        require("./src/game/init")()
    }
    else
    {
        util.print("warn","Init Script not found!")
        electron.dialog.showMessageBoxSync(null,{title:"No Init Script!",message:"There's no Init Script in the Game folder!",detail:"Contact the Developer!",type:"warning",buttons:["Ok"]})
        escreen.SwitchToEScreen("dummy",0)
    }
    mainWorker(Render)
}