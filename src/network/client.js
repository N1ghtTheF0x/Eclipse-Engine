const IOc = require("socket.io-client")
const utils = require("./../utils")

class EClient
{
    constructor(ip="localhost",port=2411)
    {
        this.ip = ip
        this.port = port
        this.address = this.ip+":"+this.port
        this.client = IOc("http://"+this.ip+":"+this.port+"/")
        utils.print("info","Created Client to Server "+this.ip+":"+this.port)
    }
    sendData(onEvent="data",data)
    {
        this.client.emit(onEvent,data)
    }
}
module.exports = EClient