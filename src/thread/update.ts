import {EGame} from "../game"
import {EScreens} from "../screen"
export function UpdateTick(Game: EGame,Screen: EScreens.EScreen,UpdateFunction: EScreens.EScreenUpdate)
{
    Game.hooks.beforeupdate(Game)
    UpdateFunction(Game,Screen)
    Game.hooks.afterupdate(Game)
}