const electron = require("electron")
const ServerC = require("./src/network/server")
const package = require("./package.json")
const util = require("./src/utils")
util.print("info","[ Eclipse Engine v"+package.version+" ] - "+package.name)
function Window()
{
    var server = false
    const win = new electron.BrowserWindow(
        {
            title:"Eclipse Engine - Blank Project",
            webPreferences:
            {
                nodeIntegration:true,
                nodeIntegrationInSubFrames:true,
                nodeIntegrationInWorker:true,
                enableRemoteModule:true,
                worldSafeExecuteJavaScript:true,
                webgl:true
            },
            width:640,
            height:400,
            icon:"./textures/icon.ico"
        }
    )
    win.setMenu(null)
    if(process.argv.includes("--edev"))
    {
        util.print("info","Opening Developer Tools...")
        win.webContents.openDevTools()
    }
    if(process.argv.includes("--server"))
    {
        util.print("info","Starting Server on Port 2411...")
        server = true
        const Server = new ServerC(2411)
        Server.listen()
    }
    if(!server)
    {
        util.print("info","Starting Electron Window...")
        win.loadFile("index.html")
    }
}
electron.app.whenReady().then(Window)
.catch(function(err)
{
    util.print("error",err)
})
setTimeout(function()
{
    util.print("warn","To view the actual log of the engine, use the developer console. You can only find errors from Electron, not the engine!")
},1000*5)