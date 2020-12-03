class EIncomingMessage
{
    /**
     * A Message you get from the Client or Server
     * @param {"get"|"set"} action - Type of Action. Do you want to GET info or SET info?
     * @param {string} uid - The **U**ser **ID** to send the data. Server's User ID is `ee-server`
     * @param {*} data - The Data of the Message. Can be anything
     */
    constructor(action="get",uid="",data)
    {
        this.action = action
        this.uid = uid
        this.data = data
    }
}
module.exports = {
    incomingMessage:EIncomingMessage
}