(function()
{
    
})()


// Creating the Main Game Object
const Game = window["eclipseengine"].createGame(window,{})
Game.dialog = window["eclipseengine"].getDialog()
const argv = window["eclipseengine"].getArguments()

Game.createERender()

const utils = new Game.utils("html.ts")
const options = Game.eoptions

if(!options.HasOptionFile())
{
    options.CreateOptionFile()
}

const OPTIONS = (options.HasOptionFile()) ? options.GetOptionFile() : {}

Game.options = OPTIONS

utils.print("info","Creating Window...")
// Setting the Render up
Game.render.Init()
// Setting Commandline Parameters
Game.DEBUG.on,Game.DEBUG.statsondisplay = argv.includes("--edebug") || argv.includes("-D")
Game.DEBUG.isdevconon = argv.includes("--edev") || argv.includes("-d")
Game.hardware = argv.includes("--hardware") || argv.includes("-h")
// Now finding the "./src/game/init.js" file and executing it if exist
const game_packaged = Game.io.PathResolve(__dirname,"src","game","init.js") // If the game is packed by electron-builder
const game_devtest = "./src/game/init.js" // If the game is run via the console command "electron ."
if(Game.io.FileExists(game_devtest)||Game.io.FileExists(game_packaged))
{
    try
    {
        utils.print("info","Executing Game Init Script...")
        require("./src/game/init.js")(Game)
    }
    catch(err)
    {
        utils.print("error","Error at init.js!\n\n"+err+"\n")
        console.dir(err)
    }
}
else
{
    // You cannot launch the game without the "init.js" script
    if(typeof game_devtest==="string")
    {
        // Contacts the dev working currently
        Game.dialog.showErrorBox("init.js is missing!","The init.js in '<root>/src/game/' is missing! Please make sure it returns a function as a module!")
    }
    Game.dialog.showMessageBoxSync(null,{title:"No Init Script!",message:"There's no Init Script in the Game folder!",detail:"Contact the Developer!",type:"warning",buttons:["Ok"]})
    Game.SwitchToEScreen("dummy",true)
}
// Turning on the Render and Input Handler
Game.StartRender()
Game.input.Init(Game.input)