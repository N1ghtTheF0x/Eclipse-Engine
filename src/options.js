const fs = require("fs")
const game = require("./game")

class EOptionTemplate
{
    constructor()
    {
        this.mute = false
        this.discordrpc =
        {
            id:"",
            tokem:""
        }
        this.hardware = false
    }
}

const template = new EOptionTemplate()

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
                WriteOptions(template)
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
            const file = fs.readFileSync(path,{encoding:"utf-8"})
            return JSON.parse(file)
        }
        else
        {
            return template
        }
    }
    return template
}
function WriteOptions(optionsOBJ=template)
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
    set:WriteOptions,
    template:EOptionTemplate
}