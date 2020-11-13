const electron = require("electron")

function Window()
{
    const win = new electron.BrowserWindow(
        {
            title:"Eclipse Engine - Blank Project",
            webPreferences:
            {
                nodeIntegration:true,
                nodeIntegrationInSubFrames:true,
                nodeIntegrationInWorker:true,
                enableRemoteModule:true
            },
            width:640,
            height:400,
            icon:"./textures/icon.ico"
        }
    )
    win.setMenu(null)
    win.loadFile("index.html")
    if(process.argv.includes("--edev"))
    {
        win.webContents.openDevTools()
    }
}
electron.app.whenReady().then(Window)
.catch(function(err)
{
    console.error(err)
})