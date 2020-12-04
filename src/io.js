const fs = require("fs")

function CheckIfFileExist(path="")
{
    return fs.existsSync(path)
}