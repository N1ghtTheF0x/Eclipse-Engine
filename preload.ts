import * as electron from "electron"
import {EGame} from "./src/game"

electron.contextBridge.exposeInMainWorld(
    "eclipseengine",
    {
        createGame(WINDOW: Window,Options: {}): EGame
        {
            return new EGame(WINDOW,Options)
        },
        getArguments(): string[]
        {
            return process.argv
        },
        getDialog(): electron.Dialog
        {
            return electron.dialog
        },
        sendToMain(channel: string,...args: any[])
        {
            const validChannels = []
            if(validChannels.includes(channel))
            {
                electron.ipcRenderer.send(channel,args)
            }
            else
            {
                throw new Error("Channel "+channel+" does not exist!")
            }
        }
    }
)
