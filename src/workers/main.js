const options = require("./../../options.json")
const render = require("./../render")
const util = require("./../utils")

const update = require("./update")
const draw = require("./draw")

function main(Mtimestamp=0)
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
            const FPS = render.fpsc(timestamp)
            document.getElementById("dfps").innerText = FPS
        }
        //new Worker("./src/workers/update.js",{workerData:game.main.current.updateFunc})
        new Worker("./src/workers/draw.js",{workerData:game.main.current.eobjects})
        update(game.main.current.updateFunc)
        draw(game.main.current.eobjects)
        if(options.refreshMethod==="raf")
        {
            game.intervalUpdate(requestAnimationFrame(main))
        }
        else if(options.refreshMethod==="si")
        {
            game.intervalUpdate(setInterval(main,1000/60))
        }
        else if(options.refreshMethod==="to")
        {
            game.intervalUpdate(setTimeout(main,1000/60))
        }
    }
    catch(err)
    {
        throw err
    }
}
module.exports =
{
    main:main
}