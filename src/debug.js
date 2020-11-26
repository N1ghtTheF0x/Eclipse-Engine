const eobjects = require("./objects")

function LastPressed()
{
    const LastKey = require("./game").main.render.input.keyboardPressed.lastKey
    if(document.getElementById("pressed"))
    {
        document.getElementById("pressed").innerText = LastKey  
    }
}
function PlayerUpdate(player=new eobjects.player()||new eobjects.playertemp())
{
    if(document.getElementById("pxsp"))
    {
        document.getElementById("pxsp").innerText = player.xsp  
    }
    if(document.getElementById("pysp"))
    {
        document.getElementById("pysp").innerText = player.ysp  
    }
    if(document.getElementById("facing"))
    {
        document.getElementById("facing").innerText = player.facing  
    }
    if(document.getElementById("ishit"))
    {
        document.getElementById("ishit").innerText = player.hit  
    }
    if(document.getElementById("px"))
    {
        document.getElementById("px").innerText = player.x
    }
    if(document.getElementById("py"))
    {
        document.getElementById("py").innerText = player.y  
    } 
    if(document.getElementById("protation"))
    {
        document.getElementById("protation").innerText = player.rotation
    } 
}
module.exports =
{
    LastPressed:LastPressed,
    PlayerUpdate:PlayerUpdate
}