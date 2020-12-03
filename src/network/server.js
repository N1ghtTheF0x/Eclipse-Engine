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
        this.connections = []
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
    AddHandler(handler=function(socket=new net.Socket()){})
    {
        if(!this.handlers.includes(handler))
        {
            this.handlers.push(handler)
        }
    }
    RequestData(socket=new net.Socket(),uid="",neededData)
    {
        if(socket.uid)
        {
            socket.setEncoding("utf-8")
            const msg = new netcommon.incomingMessage("get",socket.uid,{need:neededData})
            socket.write(JSON.stringify(msg))
            const request = function(data=Buffer.from())
            {
                const datarequest = data.toString().replace("\r\n")
                const json = JSON.parse(datarequest)
                if(json.uid===uid)
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
        else
        {
            utils.print("info","Access denied to "+socket.localAddress+":"+socket.localPort)
        }
    }
}
module.exports = EServer