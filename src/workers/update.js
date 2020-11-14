const utils = require("./../utils")
const controls = require("./../input").controls
function Tick(UpdateFunction=function(controls=controls){})
{
    UpdateFunction(controls)
}
module.exports = Tick