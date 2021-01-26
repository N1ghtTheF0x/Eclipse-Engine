const fs = require("fs")
const electron = require("electron").remote
const path = require("path")
const utils = require("./utils")

const OPTIONS_PATH_FILE = path.resolve(electron.process.resourcesPath,"options.json")

module.exports = 
{
    /**
     * Returns `true` if the Option File exists
     * @returns {boolean}
     */
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
    /**
     * Returns the Option File as Object
     * @returns {{}}
     */
    GetOptionFile()
    {
        if(this.HasOptionFile())
        {
            return JSON.parse(fs.readFileSync(OPTIONS_PATH_FILE,{encoding:"utf-8"}))
        }
        else
        {
            utils.print("warn","Could not get Option File - File does not exist!")
            return {}
        }
    },
    /**
     * Creates a new Option File
     */
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
    /**
     * Updates the Option File
     * @param {{}} newOption 
     */
    UpdateOptionFile(newOption)
    {
        const oldOption = this.GetOptionFile()
        const constructedOption = {...oldOption,...newOption}
        fs.writeFileSync(OPTIONS_PATH_FILE,JSON.stringify(constructedOption),{encoding:"utf-8"})
    }
}