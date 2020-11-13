const options = require("./../../options.json")
const render = require("./../render")
const util = require("./../utils")
const game = require("./../game")

const worker = require("worker_threads")

function main(Mtimestamp)
{
    var timestamp = 0
    if(options.refreshMethod==="raf")
    {
        timestamp = Mtimestamp
    }
    else
    {
        timestamp = performance.now()
    }
    render.fpsc(timestamp)
    const update = new worker.Worker("./update.js",{workerData:game.main.current.updateFunc})
    const draw = new worker.Worker("./draw.js",{workerData:game.main.current.eobjects})
    if(options.refreshMethod==="raf")
    {
        requestAnimationFrame(main)
    }
    else if(options.refreshMethod==="si")
    {
        setInterval(main,1000/60)
    }
    else if(options.refreshMethod==="to")
    {
        setTimeout(main,1000/60)
    }
}
util.print("info","Initialized Main Worker")