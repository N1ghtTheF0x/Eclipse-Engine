const utils = require("./../utils")
const net = require("net")
const netcommon = require("./common")

class EServer
{
    /**
     * Creates a Server for Clients to connect to
     * @param {number} port - The Port to Listen to
     */
    constructor(port=2411)
    {
        /**
         * The Port of the Server
         */
        this.port = port
        /**
         * The `net.Server` Object from the `net` Module
         */
        this.server = net.createServer()
        var server = this.server
        /**
         * The IP-Address of the Server
         */
        this.address = this.server.address
        /**
         * A Array of connections of `EClient` Objects
         */
        this.connections = []
        /**
         * 
         */
        this.handlers = []
        var handlers = this.handlers
        var self = this
        this.server.on("close",function()
        {
            utils.print("info","The Server has closed")
        })
        this.server.on("connection",function(socket)
        {
            utils.print("info","Client "+socket.localAddress+":"+socket.localPort+" connected to the server!")
            for(const handler of handlers)
            {
                if(typeof handler==="function")
                {
                    handler(socket)
                }
            }
            
        })
        this.server.on("error",function(err)
        {
            utils.print("error","An error has occured:\n\n"+err)
        })
        this.server.on("listening",function()
        {
            utils.print("info","Started listening on "+self.port)
        })
    }
    /**
     * Starts the Server and listening for connections
     */
    listen()
    {
        this.server.listen(this.port)
    }
    /**
     * Adds an Handler for the Sockets
     * @param {function(net.Socket): void} handler 
     */
    AddHandler(handler)
    {
        if(!this.handlers.includes(handler))
        {
            this.handlers.push(handler)
        }
    }
    /**
     * Request a User to send Data
     * @param {net.Socket} socket - The Socket to request Data
     * @param {string} userkey - The Key of the Socket
     * @param {any} neededData - The Data the server wants
     */
    RequestData(socket,userkey,neededData)
    {
        socket.setEncoding("utf-8")
        const msg = new netcommon.incomingMessage("get",userkey,{need:neededData})
        socket.write(JSON.stringify(msg))
        /**
         * @param {Buffer} data 
         */
        const request = function(data)
        {
            const datarequest = data.toString().replace("\r\n")
            const json = JSON.parse(datarequest)
            if(json.userkey===userkey)
            {
                if(json.data)
                {
                    return json.data
                }
            }
            socket.removeListener("data",request)
        }
        socket.on("data",request)
    }
}
module.exports = EServer