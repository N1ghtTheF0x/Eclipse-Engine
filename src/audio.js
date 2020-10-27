const util = require("./utils")
var idGiver = 0
class EAudio
{
    /**
     * An easy to use Audio Class
     * @param {string} src - Path to audio file (MP3/OGG) 
     * @param {boolean} loop - Should the audio loop when finished?
     */
    constructor(src="",loop=false)
    {
        /**
         * The Path to the audio
         */
        this.src = src
        /**
         * Get ot set if audio should loop
         */
        this.loop = loop
        try
        {
            this._audio = new Audio(this.src)
        }
        catch(err)
        {
            print("warn","The Audio Path is wrong or not present!")
            print("error",err)
        }
        this._audio.loop=this.loop
        /**
         * Has the audio stopped by the stop function?
         */
        this.stopped = false
        /**
         * A ID given by idGiver
         */
        this.id = idGiver
        idGiver++
    }
    /**
     * Play the audio
     * @param {number} ms - Where to start in MS, Default is 0 
     */
    play(ms=0)
    {
        if(!options.mute)
        {
            this._audio.currentTime=ms*1000
            const SRC = this.src
            this._audio.play()
            .then(function()
            {
                util.Dprint("Playing "+SRC)
            })
            .catch(function(err)
            {
                util.print("error","Couldn't play audio: \n\n"+err)
            })
            this.stopped=false
        }
    }
    /**
     * Pause the audio
     */
    pause()
    {
        try
        {
            const SRC = this.src
            const TIME = this._audio.currentTime
            this._audio.pause()
            util.Dprint("Paused "+SRC+" at "+TIME)
            this.stopped=false    
        }
        catch (err)
        {
            util.print("error","Couldn't pause "+SRC+":\n\n"+err)
        }
    }
    /**
     * Stops the audio
     */
    stop()
    {
        try
        {
            const SRC = this.src
            this._audio.currentTime=0
            this._audio.pause()
            util.Dprint("Stopped "+SRC)
            this.stopped = true
        }
        catch(err)
        {
            util.print("error","Couldn't stop "+SRC+":\n\n"+err)
        }
    }
    /**
     * Returns a boolean if the audio is paused
     * @returns true | false
     */
    isPaused()
    {
        return this._audio.paused
    }
}
module.exports =
{
    audio:EAudio
}