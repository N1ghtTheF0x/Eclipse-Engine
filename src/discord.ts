import * as drpc from "discord-rpc"

export interface EDiscord
{
    id: string
    token: string
    client: drpc.Client
    loggedIn: boolean
}
export class EDiscord
{
    /**
     * The Discord Rich Presence Client. Shows cool stuff on Discord! You need to create an Application at https://discord.com/developers/applications
     * @param {string} id  - The ID of the Application
     * @param {string} token - The Secret Token of the Application. Better hide it!
     */
    constructor(id: string,token: string)
    {
        this.id = id
        this.token = token
        this.client = new drpc.Client({transport:"ipc"})
        this.loggedIn = false
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
        if(this.loggedIn)
        {
            return this.client.user
        }
    }
    /**
     * @ignore
     */
    _loggedin(bool: boolean)
    {
        this.loggedIn=bool
    }
    /**
     * Sets The Presence of the Discord User (Playing \*insert game title\*)
     * @param {drpc.Presence} data - The Presence to Set
     */
    setActivity(data: drpc.Presence)
    {
        if(this.loggedIn)
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
            test.login({clientId:"804675079559839745",clientSecret:"woyF647e8AozfJwpDDuVDHBA8cIj0uJ2"})
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
export interface EDiscordManager
{
    
}
export class EDiscordManager
{
    constructor()
    {

    }
    createClient(id: string,string: string): EDiscord
    {
        return new EDiscord(id,string)
    }
}