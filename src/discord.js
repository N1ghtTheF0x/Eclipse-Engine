const drpc = require("discord-rpc")
const options = require("./options")
const discord =
{
    id:options.get().discordrpc.id,
    token:options.get().discordrpc.token,
    discordRPC:new drpc.Client({transport:"ipc"})
}
try
{
    discord.discordRPC = new drpc.Client({transport:"ipc"})
}
catch(err)
{
    util.print("warn","Couldn't connect to Discord Client!")
}
try
{
    discord.discordRPC.login({clientId:options.get().discordrpc.id,clientSecret:options.get().discordrpc.token}).catch(console.error).then(function(client)
    {
        util.print("info","Discord User Client detected!")
        util.print("info","Username: "+client.user.username)
        player.name=client.user.username
        discord.discordRPC.setActivity({startTimestamp:new Date()})
    })
}
catch (error)
{
    util.print("warn","Discord User Client not detected!")
}
module.exports = discord