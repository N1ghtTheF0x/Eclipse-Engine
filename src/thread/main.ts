import {EUtils} from "./../utils"

import {DrawTick} from "./draw"
import {UpdateTick} from "./update"
import {EGame} from "./../game"

const utils: EUtils = new EUtils("thread/main.ts")

/**
 * The heart of the Main Thread. This is the Loop function
 * @param {number} Mtimestamp - Delta Timestamp stuff
 * @param {EGame} Game - The Main Game Object
 */
function main(Mtimestamp: number,Game: EGame)
{
    const Render = Game.render
    if(document.getElementById("dfps"))
    {
        const FPS = Render.FramesPerSecondCalc(Mtimestamp)
        document.getElementById("dfps").innerText = String(FPS)
    }
    UpdateTick(Game,Game.current,Game.current.update)
    DrawTick(Game)
    Game.input.ControllerUpdate(0)
    Game.input.ControllerUpdate(1)
    Game.input.ControllerUpdate(2)
    Game.input.ControllerUpdate(3)
    Game.UpdateInterval(Render.window.requestAnimationFrame(function(time)
    {
        main(time,Game)
    }))
}
export function MainThread(Game: EGame)
{
    Game.UpdateInterval(Game.render.window.requestAnimationFrame(function(time)
    {
        main(time,Game)
    }))
    utils.print("info","Started Main Worker")
}