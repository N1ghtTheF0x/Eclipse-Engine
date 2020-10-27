const drpc = require("discord-rpc")
const discord =
{
    id:"717801948291792986",
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
    discord.discordRPC.login({clientId:discord.id,clientSecret:"vdr7KbZjdhUXpd8qGdSj3EqWxAKcflgD"}).catch(console.error).then(function(client)
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