const fs = require("fs")
const electron = require("electron").remote
const path = require("path")
const utils = require("./utils")

const OPTIONS_PATH_FILE = path.resolve(electron.process.resourcesPath,"options.json")

module.exports = 
{
    HasOptionFile()
    {
        if(fs.existsSync(OPTIONS_PATH_FILE))
        {
            return true
        }
        else
        {
            return false
        }
    },
    GetOptionFile()
    {
        if(this.HasOptionFile())
        {
            if(fs.accessSync(OPTIONS_PATH_FILE,fs.constants.F_OK))
            {
                return JSON.parse(fs.readFileSync(OPTIONS_PATH_FILE,{encoding:"utf-8"}))
            }
            else
            {
                utils.print("warn","Could not read Option File - Read Access Denied!")
                return {}
            }
        }
        else
        {
            utils.print("warn","Could not get Option File - File does not exist!")
            return {}
        }
    },
    CreateOptionFile()
    {
        if(!this.HasOptionFile())
        {
            fs.writeFileSync(OPTIONS_PATH_FILE,JSON.stringify({}),{encoding:"utf-8"})
        }
        else
        {
            utils.print("warn","Could not create Option File - File already exists!")
        }
    },
    UpdateOptionFile(newOption={})
    {
        const oldOption = JSON.parse(this.GetOptionFile())
        const constructedOption = {...oldOption,newOption}
        fs.writeFileSync(OPTIONS_PATH_FILE,JSON.stringify(constructedOption),{encoding:"utf-8"})
    }
}