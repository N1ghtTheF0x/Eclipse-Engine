const drpc = require("discord-rpc")
const djs = require("discord.js")
const game = require("./game")

class EDiscord
{
    constructor(id="",token="")
    {
        this.id = id
        this.token = token
        this.client = new drpc.Client({transport:"ipc"})
        this.loggedin = false
    }
    login()
    {
        if(TestDiscordFeature())
        {
            var self = this
            this.client.login({clientId:this.id,clientSecret:this.token})
            .then(function()
            {
                self._loggedin(true)
            })
        }
    }
    getUser()
    {
        if(this.loggedin)
        {
            return this.client.user
        }
    }
    _loggedin(bool=true)
    {
        this.loggedin=bool
    }
    setActivity(data={
        state: "string",
        details: "string",
        startTimestamp: new Date(),
        endTimestamp: new Date(),
        largeImageKey: "string",
        largeImageText: "string",
        smallImageKey: "string",
        smallImageText: "string",
        instance: false,
        partySize: 0,
        partyMax: 0,
        matchSecret: "string",
        spectateSecret: "string",
        joinSecret: "string"
        })
    {
        if(this.loggedin)
        {
            this.client.setActivity(data)
        }
    }
}
function TestDiscordFeature()
{
    try
    {
        const test = new drpc.Client({transport:"ipc"})
        try
        {
            test.login({clientId:"783045668398825503",clientSecret:"x_2zftECr4nAX-rDK8KnPWVu9CQySMRf"})
        }
        catch(error)
        {
            return false
        }
    }
    catch(error)
    {
        return false
    }
    return true
}
module.exports = EDiscord