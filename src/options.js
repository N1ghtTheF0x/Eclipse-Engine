const fs = require("fs")

module.exports = class EOptions
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
    APPDATA()
    {
        return (process.env.APPDATA) ? process.env.APPDATA : false
    }
    ET_FOLDER()
    {
        return (this.APPDATA()!==false&&APPDATA+"\\EclipseTeam") ? this.APPDATA()+"\\EclipseTeam" : false
    }
    OPTIONS_FILE()
    {
        return (this.ET_FOLDER()!==false&&this.ET_FOLDER()+"\\options.json") ? this.ET_FOLDER()+"\\options.json" : false
    }
    HasOptions(write=false)
    {
        if(this.OPTIONS_FILE())
        {
            return true
        }
        else
        {
            if(write)
            {
                if(!this.APPDATA())
                {
                    if(!this.ET_FOLDER())
                    {
                        fs.mkdirSync(this.APPDATA()+"\\EclipseTeam",{recursive:true})
                    }
                    fs.writeFileSync(this.APPDATA()+"\\EclipseTeam\\options.json",{},{encoding:"utf-8"})
                }
            }
            return false
        }
    }
    /**
     * @returns {EOptions}
     */
    GetOptions()
    {
        if(this.OPTIONS_FILE())
        {
            const optionsFile = JSON.parse(fs.readFileSync(this.OPTIONS_FILE()))
            if(optionsFile!=={})
            {
                return optionsFile
            }
            else
            {
                return null
            }
        }
    }
    WriteOptions(options=new EOptions())
    {
        this.discordrpc=options.discordrpc
        this.hardware=options.hardware
        this.mute=options.mute
        if(this.HasOptions(false))
        {
            fs.writeFileSync(this.OPTIONS_FILE(),JSON.stringify(this),{encoding:"utf-8"})
        }
    }
}