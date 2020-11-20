const options = require("./../../options.json")
const render = require("./../render")
const util = require("./../utils")

const update = require("./update")
const draw = require("./draw")

function ERequestAnimationFrame(game=require("./../game"),callback=function(time=0,Render=new render.render()){},Render=new render.render())
{
    game.intervalUpdate(requestAnimationFrame(function(time)
    {
        callback(time,Render)
    }))
    ERequestAnimationFrame(game,callback,Render)
}

function main(Mtimestamp=0,Render=new render.render())
{
    try
    {
        const game = require("./../game")
        var timestamp = 0
        if(options.refreshMethod==="raf")
        {
            timestamp = Mtimestamp
        }
        else
        {
            timestamp = performance.now()
        }
        if(document.getElementById("dfps"))
        {
            const FPS = render.FPSC(Render,timestamp)
            document.getElementById("dfps").innerText = FPS
        }
        //new Worker("./src/workers/update.js",{workerData:game.main.current.updateFunc})
        new Worker("./src/workers/draw.js",{workerData:game.main.current.eobjects})
        update(Render,game.main.current.updateFunc)
        draw(Render,game.main.current.eobjects)
    }
    catch(err)
    {
        throw err
    }
}
function MAIN(Render=new render.render())
{
    const game = require("./../game")
    if(options.refreshMethod==="raf")
    {
        ERequestAnimationFrame(game,main,Render)
    }
    else if(options.refreshMethod==="si")
    {
        game.intervalUpdate(setInterval(mein,1000/60))
    }
    else if(options.refreshMethod==="to")
    {
        game.intervalUpdate(setTimeout(mein,1000/60))
    }
}
module.exports =
{
    main:MAIN
}