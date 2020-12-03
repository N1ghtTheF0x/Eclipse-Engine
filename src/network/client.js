const net = require("net")
const utils = require("./../utils")

class EClient
{
    constructor(ip="localhost",port=2411)
    {
        this.ip = ip
        this.port = port
        this.address = ""
        this.family = ""
        this.host = ""
        this.client = new net.Socket()
        this.onconnect = function(){utils.print("info","Connected to the Server!")}
        this.ondrain = function(){}
        this.ondataHandlers = [function(data=Buffer.from()){}]
        this.onend = function(){}
        this.connected = false
        const self = this
        
        this.client.on("close",function(haderror)
        {
            if(haderror)
            {
                utils.print("error","An unknown Error has closed the connection!")
            }
            else
            {
                utils.print("info","Connection closed.")
            }
        })
        this.client.on("connect",function()
        {
            self._updateconntected(true)
        })
        this.client.on("data",function(data)
        {
            for(const handler of self.ondataHandlers)
            {
                if(typeof handler==="function")
                {
                    handler(data)
                }
            }
        })
        this.client.on("drain",this.ondrain)
        this.client.on("end",this.onend)
        this.client.on("error",function(err)
        {
            utils.print("error","An Error has occured:\n\n"+err)
        })
        this.client.on("lookup",function(err,address,family,host)
        {
            if(err)
            {
                utils.print("error","An Error has occured:\n\n"+err)
            }
            self._updatelookup(address,family,host)
        })
        this.client.on("timeout",function()
        {
            utils.print("info","Conntection has timed out!")
        })
        this.client.on("ready",function()
        {
            utils.print("info","Client is ready!")
        })
    }
    connect()
    {
        this.client.connect({host:this.ip,port:2411})
    }
    writeData(data={})
    {
        this.client.setEncoding("utf-8")
        const json = JSON.stringify(data)
        this.client.write(json,function(err)
        {
            if(err)
            {
                utils.print("error","An Error has occured:\n\n"+err)
            }
        })
    }
    writeString(string="")
    {
        this.client.setEncoding("utf-8")
        this.client.write(string,function(err)
        {
            if(err)
            {
                utils.print("error","An Error has occured:\n\n"+err)
            }
        })  
    }
    _updatelookup(address="",family="",host="")
    {
        this.address = address
        this.family = family
        this.host = host
    }
    _updateconntected(boolean=false)
    {
        this.connected = boolean
    }
    _onconnect(callback=function(){})
    {
        this.onconnect = callback
        this.onconnect()
    }
    _ondrain(callback=function(){})
    {
        this.ondrain = callback
        this.ondrain()
    }
    addDataHandler(handler=function(data=Buffer.from()){})
    {
        this.ondataHandlers.push(handler)
    }
}
module.exports = EClient