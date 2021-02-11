import * as electron from "electron"
import * as fs from "fs"
import * as path from "path"

import EServer from "./src/network/server"
import {EUtils} from "./src/utils"

const util = new EUtils("index.ts")

var EXE_TITLE = "Eclipse Engine - Blank Project"

const config: {} = (fs.existsSync("./conf/config.json")||fs.existsSync(path.resolve(__dirname,"./conf/config.json"))) ? require("./conf/config.json") : require("./conf/default.json")

if(typeof config["title"]==="string")
{
    EXE_TITLE = config["title"]
}
function CreateServer(Port=0)
{
    util.print("info","Starting Server on Port "+Port)
    const Server = new EServer(Port)
    Server.listen()
}

util.print("info","[ Eclipse Engine - v"+config["version"]+" ]")
function Window()
{
    const args = process.argv
    const win = new electron.BrowserWindow(
        {
            title:EXE_TITLE,
            webPreferences:
            {
                nodeIntegration:false,
                enableRemoteModule:false,
                contextIsolation:true,
                webgl:true,
                worldSafeExecuteJavaScript:true,
                preload:path.join(__dirname,"preload.js")
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
    else if(args.includes("--help")||args.includes("-h")||args.includes("-?"))
    {
        const message =
        `
        ${config["name"]} v${config["version"]} by ${config["author"].name}

        [COMMANDLINE-PARAMETERS]

        --edev            | -d          Developer Tools
        --edebug          | -D          Enable Debug
        --hardware        | -H          Enable Hardware Render
        --server [<port>] | -s [<port>] Runs Server instead of Client
        `
        console.info(message)
        process.exit(0)
    }
    else
    {
        util.print("info","Starting Electron Window...")
        win.loadFile("index.html")
        .then(function()
        {
            if(args.includes("--edev")||args.includes("-d"))
            {
                util.print("warn","Developer Tools on! Don't report bugs/glitches if this is on and you have executed code inside!")
                win.webContents.openDevTools({mode:"detach",activate:false})
            }
            if(args.includes("--edebug")||args.includes("-D"))
            {
                util.print("warn","Debug has been enabled! Bug/Glitch reports are invalid when this option is enabled")
            }
            if(args.includes("--hardware")||args.includes("-H"))
            {
                util.print("warn","Hardware Render has been enabled! This Render is still work in progresss!")
            }
        })
        .catch(function(err)
        {
            util.print("error","Couldn't load Window!\n\n"+err)
        })
    }
    
}

electron.app.whenReady().then(Window)
.catch(function(error)
{
    util.print("error",error)
})