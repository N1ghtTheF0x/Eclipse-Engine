const electron = require("electron").remote

class EEError extends Error
{
    /**
     * Creates an Error and shows it to the User
     * @param {string} message 
     */
    constructor(message)
    {
        super(message)
        electron.dialog.showErrorBox("Error! "+this.name,this.message+"\n\n"+this.stack)
    }
}
module.exports =
{
    EEError
}