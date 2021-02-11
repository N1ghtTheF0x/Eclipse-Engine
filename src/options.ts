import * as fs from "fs"
import { remote } from "electron"
import * as path from "path"
import {EUtils} from "./utils"

const utils: EUtils = new EUtils("options.ts")

type EOptionsObject = {}

export interface EOptions
{
    OPTIONS_PATH_FILE: string
}
export class EOptions
{
    constructor(resourcesPath: string)
    {
        this.OPTIONS_PATH_FILE = path.resolve(resourcesPath,"options.json")
    }
    /**
     * Returns `true` if the Option File exists
     * @returns {boolean}
     */
    HasOptionFile(): boolean
    {
        if(fs.existsSync(this.OPTIONS_PATH_FILE))
        {
            return true
        }
        else
        {
            return false
        }
    }
    /**
     * Returns the Option File as Object
     * @returns {{}}
     */
    GetOptionFile(): EOptionsObject
    {
        if(this.HasOptionFile())
        {
            return JSON.parse(fs.readFileSync(this.OPTIONS_PATH_FILE,{encoding:"utf-8"}))
        }
        else
        {
            utils.print("warn","Could not get Option File - File does not exist!")
            return {}
        }
    }
    /**
     * Creates a new Option File
     */
    CreateOptionFile(): boolean
    {
        if(!this.HasOptionFile())
        {
            fs.writeFileSync(this.OPTIONS_PATH_FILE,JSON.stringify({}),{encoding:"utf-8"})
            return true
        }
        else
        {
            utils.print("warn","Could not create Option File - File already exists!")
            return false
        }
    }
    /**
     * Updates the Option File
     * @param {{}} newOption 
     */
    UpdateOptionFile(newOption: EOptionsObject): void
    {
        const oldOption = this.GetOptionFile()
        const constructedOption = {...oldOption,...newOption}
        fs.writeFileSync(this.OPTIONS_PATH_FILE,JSON.stringify(constructedOption),{encoding:"utf-8"})
    }
}