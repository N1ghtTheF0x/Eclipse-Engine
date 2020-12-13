const electron = require("electron")
const EServer = require("./src/network/server")
const package = require("./package.json")
const util = require("./src/utils")
const path = require("path") 

function CreateServer(Port=0)
{
    util.print("info","Starting Server on Port "+Port)
    const Server = new EServer(Port)
    Server.listen()
}

util.print("info","[ Eclipse Engine - v"+package.version+" ]")
function Window()
{
    const args = process.argv
    const win = new electron.BrowserWindow(
        {
            title:"Eclipse Engine - Blank Project",
            webPreferences:
            {
                nodeIntegration:true,
                enableRemoteModule:true,
                contextIsolation:false,
                webgl:true,
                worldSafeExecuteJavaScript:true
            },
            width:1280,
            height:720,
            icon:"./textures/common/icon.ico"
        }
    )
    win.setMenu(null)
    if(args.includes("--server"))
    {
        const INDEX = args.indexOf("--server")
        const PORT = parseInt(args[INDEX+1])
        if(typeof PORT==="number")
        {
            CreateServer(PORT)
        }
        else
        {
            CreateServer(2411)
        }
    }
    else if(args.includes("-s"))
    {
        const INDEX = args.indexOf("-s")
        const PORT = parseInt(args[INDEX+1])
        if(typeof PORT==="number")
        {
            CreateServer(PORT)
        }
        else
        {
            CreateServer(2411)
        }
    }
    else
    {
        util.print("info","Starting Electron Window...")
        win.loadFile("index.html")
        .then(function()
        {
            if(args.includes("--edev")||args.includes("-d"))
            {
                util.print("warn","Developer Tools on! Don't report bugs/glitches if this is on!")
                win.webContents.openDevTools({mode:"detach",activate:false})
            }
        })
    }
    
}
electron.app.whenReady().then(Window)
.catch(function(error)
{
    util.print("error",error)
})
.finally(function()
{
    util.print("warn","Only log of Electron visible here. To view the log of the game, start the game with developer tools")
})