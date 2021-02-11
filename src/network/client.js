const net = require("net")
const utils = require("./../utils")
const netcommon = require("./common")

class EClient
{
    constructor(ip="localhost",port=2411)
    {
        /**
         * The IP-Address of the Server
         */
        this.ip = ip
        /**
         * The Port of the Server
         */
        this.port = port
        /**
         * The IP-Address of the Client
         */
        this.address = ""
        /**
         * The IP-Protocal of the Client
         */
        this.family = ""
        /**
         * A Duplicate of 
         * ```
         * this.ip
         * ```
         */
        this.host = ""
        /**
         * The `net.Socket` from the `net` module
         */
        this.client = new net.Socket()
        /**
         * This function executes if the socket is connected
         */
        this.onconnect = function(){utils.print("info","Connected to the Server!")}
        this.ondrain = function(){}
        /**
         * An Array of functions to handle data received by the server
         * @type {(function(Buffer): void)[]}
         */
        this.ondataHandlers = []
        /**
         * Executes when the socket has stopped writing to the Server
         */
        this.onend = function(){}
        /**
         * When true, the Client is connected to the Server
         */
        this.connected = false
        /**
         * The Client's special Key to identify
         */
        this.key = netcommon.generateKey()
        /**
         * The Server's special Key to send Data
         */
        this.serverkey = null
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
        this.client.connect({host:this.ip,port:this.port})
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
    /**
     * @ignore
     */
    _updatelookup(address="",family="",host="")
    {
        this.address = address
        this.family = family
        this.host = host
    }
    /**
     * @ignore
     */
    _updateconntected(boolean=false)
    {
        this.connected = boolean
    }
    /**
     * @ignore
     */
    _onconnect(callback=function(){})
    {
        this.onconnect = callback
        this.onconnect()
    }
    /**
     * @ignore
     */
    _ondrain(callback=function(){})
    {
        this.ondrain = callback
        this.ondrain()
    }
    /**
     * @ignore
     */
    addDataHandler(handler=function(data=Buffer.from()){})
    {
        this.ondataHandlers.push(handler)
    }
}
module.exports = EClient