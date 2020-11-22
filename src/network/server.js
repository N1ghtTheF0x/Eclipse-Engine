const serverC = require("socket.io")
const utils = require("./../utils")

class EServer
{
    constructor(port=2411)
    {
        this.server = new serverC.Server({path:"/",serveClient:true})
        this.port = port
        this.address4 = "0.0.0.0"
        this.address6 = "::"
        this.handlers = []
        this.server.on("connect",function(socket=new serverC.Socket())
        {
            utils.print("info","A User has connected: "+socket.id)
        })
        utils.print("info","Created Server on Port "+this.port)
    }
    listen()
    {
        this.server.listen(this.port)
        utils.print("info","Started listening")
    }
    broadcast()
    {
        this.server.emit()
    }
}
module.exports = EServer