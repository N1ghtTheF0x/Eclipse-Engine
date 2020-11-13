const drpc = require("discord-rpc")
const options = require("./../options.json")
const discord =
{
    id:options.discordrpc.id,
    token:options.discordrpc.token,
    discordRPC:new drpc.Client({transport:"ipc"})
}
try
{
    discord.discordRPC = new drpc.Client({transport:"ipc"})
}
catch(err)
{
    print("warn","Couldn't connect to Discord Client!")
}
try
{
    discord.discordRPC.login({clientId:options.discordrpc.id,clientSecret:options.discordrpc.token}).catch(console.error).then(function(client)
    {
        print("info","Discord User Client detected!")
        print("info","Username: "+client.user.username)
        player.name=client.user.username
        discord.discordRPC.setActivity({startTimestamp:new Date()})
    })
}
catch (error)
{
    print("warn","Discord User Client not detected!")
}
module.exports = discord
util.print("info","Initialized Discord RPC Module")