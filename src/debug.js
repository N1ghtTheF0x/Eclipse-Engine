const eobjects = require("./objects")

function LastPressed()
{
    const input = require("./game").main.render.input
    if(document.getElementById("pressed"))
    {
        document.getElementById("pressed").innerText = input.keyboardPressed.lastKey
    }
    if(document.getElementById("cursorx"))
    {
        document.getElementById("cursorx").innerText = input.cursor.x
    }
    if(document.getElementById("cursory"))
    {
        document.getElementById("cursory").innerText = input.cursor.y
    }
}
function PlayerUpdate(player=new eobjects.player())
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
    if(document.getElementById("isground"))
    {
        document.getElementById("isground").innerText = player.ground
    }
    if(document.getElementById("isjumping"))
    {
        document.getElementById("isjumping").innerText = player.jumping
    }
}
module.exports =
{
    LastPressed:LastPressed,
    PlayerUpdate:PlayerUpdate
}