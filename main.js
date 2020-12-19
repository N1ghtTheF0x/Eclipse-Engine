const util = require("./src/utils")
const ERender = require("./src/render")
const mainWorker = require("./src/workers/main").main
const EGame = require("./src/game")
const EOptions = require("./src/options")
const path = require("path")
const fs = require("fs")
const electron = require("electron").remote

EOptions.CreateOptionFile()
util.print("info","Creating Render...")
const Render = new ERender(window)
util.print("info","Creating game...")
const OPTIONS = (EOptions.HasOptionFile()) ? EOptions.GetOptionFile() : {}
const Game = new EGame(Render,OPTIONS)
util.print("info","Creating Window...")
Game.render.Init()
Game.DEBUG=true
const game_packaged = path.resolve(__dirname,"src","game","init.js")
const game_devtest = "./src/game/init.js"
if(fs.existsSync(game_devtest)||fs.existsSync(game_packaged))
{
    util.print("info","Executing Game Init Script...")
    require("./src/game/init.js")(Game)
}
else
{
    electron.dialog.showMessageBoxSync(null,{title:"No Init Script!",message:"There's no Init Script in the Game folder!",detail:"Contact the Developer!",type:"warning",buttons:["Ok"]})
    Game.screenmanager.SwitchToEScreen("dummy",0)
}
mainWorker(Game)
Game.render.input.Init(Game.render.input)