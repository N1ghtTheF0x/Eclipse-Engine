const drpc = require("discord-rpc")
const djs = require("discord.js")

class EDiscord
{
    /**
     * The Discord Rich Presence Client. Shows cool stuff on Discord! You need to create an Application at https://discord.com/developers/applications
     * @param {string} id  - The ID of the Application
     * @param {string} token - The Secret Token of the Application. Better hide it!
     */
    constructor(id,token)
    {
        this.id = id
        this.token = token
        this.client = new drpc.Client({transport:"ipc"})
        this.loggedin = false
    }
    /**
     * Create an Connection to Discord!
     */
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
    /**
     * Gets the Details of the User if logged in
     */
    getUser()
    {
        if(this.loggedin)
        {
            return this.client.user
        }
    }
    /**
     * @ignore
     */
    _loggedin(bool=true)
    {
        this.loggedin=bool
    }
    /**
     * Sets The Presence of the Discord User (Playing \*insert game title\*)
     * @param {drpc.Presence} data - The Presence to Set
     */
    setActivity(data)
    {
        if(this.loggedin)
        {
            this.client.setActivity(data)
        }
    }
}
/**
 * Tests the Connection to Discord
 */
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