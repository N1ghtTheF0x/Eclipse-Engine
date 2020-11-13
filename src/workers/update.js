const utils = require("./../utils")
const workerDate = require("worker_threads").workerData

function Tick()
{
    if(workerDate)
    {
        workerDate()
    }
}
Tick()