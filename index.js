const electron = require("electron")
const ServerC = require("./src/network/server")

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
        win.webContents.openDevTools()
    }
    if(process.argv.includes("--server"))
    {
        server = true
        const Server = new ServerC(2411)
        Server.listen()
    }
    if(!server)
    {
        win.loadFile("index.html")
    }
}
electron.app.whenReady().then(Window)
.catch(function(err)
{
    console.error(err)
})