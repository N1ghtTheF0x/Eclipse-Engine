const util = require("./src/utils")
const ERender = require("./src/render")
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
Game.DEBUG.on,Game.DEBUG.statsondisplay=electron.process.argv.includes("--edebug")||electron.process.argv.includes("-D")
Game.DEBUG.isdevconon=electron.process.argv.includes("--edev")||electron.process.argv.includes("-d")
Game.hardware=electron.process.argv.includes("--hardware")||electron.process.argv.includes("-h")
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
    Game.SwitchToEScreen("dummy",true)
}
Game.StartRender()
Game.render.input.Init(Game.render.input)
window.game=Game