const utils = require("./../utils")
const net = require("net")

class EServer
{
    constructor(port=2411)
    {
        this.port = port
        this.server = net.createServer()
        var server = this.server
        this.address = this.server.address
        this.handlerstoadd
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
    listen()
    {
        this.server.listen(this.port)
    }
    Update()
    {
        
    }
}
module.exports = EServer