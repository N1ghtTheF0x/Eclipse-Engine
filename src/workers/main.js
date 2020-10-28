const update = require("./update")
const draw = require("./draw")
const options = require("./../../options.json")
const render = require("./../render")

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
    update.tick()
    draw.tick()
    if(options.refreshMethod==="raf")
    {
        requestAnimationFrame(main)
    }
    else if(options.refreshMethod==="si")
    {
        setInterval(main,1000/60)
    }
}
