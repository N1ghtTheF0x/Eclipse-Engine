const update = require("./update")
const draw = require("./draw")
const options = require("./../../options)

function MainWorker()
{
    update()
    draw()
    if(options.refreshMethod==="raf")
    {
        requestAnimationFrame(MainWorker)
    }
    else if(options.refreshMethod==="si")
    {
        setInterval(MainWorker,1000/60)
    }
}
