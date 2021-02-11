import {EUtils} from "./utils"
import {EGame} from "./game"
import { EObjects } from "./objects"



const utils: EUtils = new EUtils("screen.ts")

export namespace EScreens
{
    export interface ELayer
    {
        objects: EObjects.EObjectList
        shouldUpdateObjects: boolean
    }
    export class ELayer
    {
        constructor(objects: EObjects.EObjectList,shouldUpateObjects = true)
        {
            this.objects = objects
            this.shouldUpdateObjects = shouldUpateObjects
        }
        /**
         * Resets all EObjects
         */
        resetObjects()
        {
            for(const object of this.objects)
            {
                object.x=object._x
                object.y=object._y
                object.z=object._z
                
                object.w=object._w
                object.h=object._h
    
                object.xsp=0
                object.ysp=0
                object.gsp=0
    
                object.scale = 1
                object.translation = [0,0]
            }
        }
    }
    
    export type EScreenID = string
    export type EScreenName = string
    export type EScreenSetup = (game: EGame,screen: EScreen) => void
    export type EScreenUpdate = (game: EGame,screen: EScreen) => void
    
    export interface EScreen
    {
        id: EScreenID
        name: EScreenName
        setup: EScreenSetup
        update: EScreenUpdate
        layers: ELayer[]
    }
    export class EScreen
    {
        /**
         * A EScreen with his own `setup` for first execution and `update` for every frame
         * @param {string} id - The name of the ID, for example: title, game, menu, multiplayer
         * @param {string} name - The displayname of the ID, for example: "Title Screen", "Ingame", "Main Menu", "Multiplayer" 
         * @param {(Maudio.EAudio|Maudio.EAudioAllegro|Maudio.EAudioBoost|Maudio.EAudioIntroLoop|Maudio.EAudioStepUp)[]} audio - A list of EAudio Objects
         * @param {(Mobjects.EObject|Mobjects.EObjectClass|Mobjects.EObjectPlayer)[]} objects - A list of EObjects
         * @param {function(EGame,EScreen): void} setup - A function that only executes once
         * @param {function(EGame,EScreen): void} update - A function that executes every frame. Contains `ERender` as first Parameter
         */
        constructor(id: EScreenID,name: EScreenName,layers: ELayer[],setup: (game: EGame,screen: EScreen) => void,update: (game: EGame,screen: EScreen) => void)
        {
            this.id = id
            this.name = name
            this.setup = setup
            this.update = update
            this.layers = layers
        }
        
    }
    export interface EScreenManager
    {
    
    }
    export class EScreenManager extends Map<EScreenID,EScreen>
    {
        /**
        * The EScreen Manager. All EScreens are found here.
        */
        constructor()
        {
            super() 
        }   
        /**
         * Adds a EScreen to the EScreen Manager via parameters
         * @param {string} id - The name of the ID, for example: title, game, menu, multiplayer
         * @param {string} name - The displayname of the ID, for example: "Title Screen", "Ingame", "Main Menu", "Multiplayer" 
         * @param {(Mobjects.EObject|Mobjects.EObjectClass|Mobjects.EObjectPlayer)[]} objects - A list of EObjects
         * @param {function(EGame,EScreen): void} setup - A function that only executes once
         * @param {function(EGame,EScreen): void} update - A function that executes every frame. Contains `ERender` as first Parameter
         */
        AddScreen(id: EScreenID,name: EScreenName,layers: ELayer[],setup: EScreenSetup,update: EScreenUpdate): boolean
        {
            const ESCREEN = new EScreen(id,name,layers,setup,update)
            if(!super.has(id))
            {
                super.set(id,ESCREEN)
                utils.print("info","Added Screen "+id)
                return true
            }
            else
            {
                utils.print("warn","Screen ID "+id+" already exists!")
                return false
            }
        }
        /**
         * Adds a `EScreen` to the EScreen Manager via a `EScreen` Object
         * @param {EScreen} screen - The EScreen Object
         */
        AddScreenObject(screen: EScreen)
        {
            if(super.has(screen.id))
            {
                utils.print("warn","Screen ID "+screen.id+" already exists!")
            }
            else
            {
                super.set(screen.id,screen)
                utils.print("info","Added Screen "+screen.id)
            }
        }
        /**
         * Removes a EScreen from the EScreen Manager
         * @param {string} id - The ID of the EScreen to remove
         */
        RemoveScreen(id: EScreenID): boolean
        {
            if(super.has(id))
            {
                return super.delete(id)
            }
            else
            {
                utils.print("info","The Screen ID "+id+" already does not exist!")
                return false
            }
        }
        /**
         * Check if the EScreen already exists
         * @param {string} id - The ID of the EScreen to check 
         */
        HasScreen(id)
        {
            if(super.has(id))
            {
                return true
            }
            else
            {
                return false
            }
        }
        createELayer(objects: EObjects.EObjectList,shouldUpateObjects = true): ELayer
        {
            return new ELayer(objects,shouldUpateObjects)
        }
        createEScreen(id: EScreenID,name: EScreenName,layers: ELayer[],setup: EScreenSetup,update: EScreenUpdate): EScreen
        {
            return new EScreen(id,name,layers,setup,update)
        }
    }
}
