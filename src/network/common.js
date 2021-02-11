const crypto = require("crypto")

class EIncomingMessage
{
    /**
     * A Message you get from the Client or Server
     * @param {"get"|"set"} action - Type of Action. Do you want to GET info or SET info?
     * @param {string} userkey - The Key of the User to send the data.
     * @param {any} data - The Data of the Message. Can be anything
     */
    constructor(action="get",userkey,data)
    {
        this.action = action
        this.userkey = userkey
        this.data = data
    }
}
module.exports = {
    incomingMessage:EIncomingMessage,
    encrypt(string="")
    {
        
    },
    decrypt(encryptedstring="")
    {
        
    },
    /**
     * Generates a 128-bit Key for Server and Client token
     */
    generateKey()
    {
        return crypto.createSecretKey(crypto.randomBytes(128)).export().toString("utf-8")
    }
}