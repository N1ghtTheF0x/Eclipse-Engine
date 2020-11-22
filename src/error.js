const electron = require("electron").remote

class EEError extends Error
{
    constructor(message="")
    {
        super(message)
        electron.dialog.showErrorBox("Error! "+this.name,this.message+"\n\n"+this.stack)
    }
}
module.exports =
{
    main:EEError
}