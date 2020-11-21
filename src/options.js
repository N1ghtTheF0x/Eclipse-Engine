const fs = require("fs")
const game = require("./game")

function HasOptions(write=false)
{
    if(process.env.APPDATA)
    {
        const path = process.env.APPDATA+"\\EclipseTeam\\options.json"
        if(fs.existsSync(path))
        {
            return true
        }
        else
        {
            if(write)
            {
                WriteOptions({mute:false,discordrpc:{id:"",token:""},hardware:false})
            }
            return false
        }
    }
    else
    {
        return false
    }
}
function GetOptions()
{
    if(process.env.APPDATA)
    {
        const path = process.env.APPDATA+"\\EclipseTeam\\options.json"
        if(HasOptions(true))
        {
            const file = require(path)
            return file
        }
        else
        {
            return {}
        }
    }
    return {}
}
function WriteOptions(optionsOBJ={})
{
    if(process.env.APPDATA)
    {
        const path = process.env.APPDATA+"\\EclipseTeam\\options.json"
        fs.mkdirSync(process.env.APPDATA+"\\EclipseTeam",{recursive:true})
        fs.writeFileSync(path,JSON.stringify(optionsOBJ),{encoding:"utf-8"})
    }
}
module.exports =
{
    has:HasOptions,
    get:GetOptions,
    write:WriteOptions
}