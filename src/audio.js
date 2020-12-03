const util = require("./utils")
const game = require("./game")
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
        this.audioContext = new AudioContext()
        try
        {
            this._audio = new Audio(this.src)
        }
        catch(err)
        {
            util.print("warn","The Audio Path is wrong or not present!")
            util.print("error",err)
        }
        this.track = this.audioContext.createMediaElementSource(this._audio)
        this.track.connect(this.audioContext.destination)
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
        if(!game.main.options.mute)
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

class EAudioStepUp
{
    constructor(EAudioArray=[new EAudio()])
    {
        this.EAudioArray = EAudioArray
        this.refrence = this.EAudioArray[0]
        this.NextToPlay = 1

    }
    play(ms=0)
    {
        this.refrence.play(ms)
    }
    nextToPlay()
    {
        if(this.NextToPlay!==null)
        {
            const eaudio = this.EAudioArray[this.NextToPlay]
            if(!this.refrence.isPaused()||!this.refrence.stopped)
            {
                eaudio.play(this.refrence._audio.currentTime)
            }
            this.NextToPlay++
            if(this.EAudioArray[this.NextToPlay])
            {
                this.NextToPlay = null
            }
        }
    }
}

class EAudioBoost
{
    constructor(main=new EAudio(),fx=new EAudio())
    {
        this.main = main
        this.fx = fx
        this.fx._audio.volume=0
        this.boosting = false
    }
    startBoost()
    {
        this.main._audio.volume=0
        this.fx._audio.volume=1
        this.boosting = true
    }
    stopBoost()
    {
        this.main._audio.volume=1
        this.fx._audio.volume=0
    }
    play(ms=0)
    {
        this.main.play(ms)
        this.fx.play(ms)
    }
    pause()
    {
        this.main.pause()
        this.fx.pause()
    }
    stop()
    {
        this.main.stop()
        this.fx.stop()
    }
}

function StopAllAudio()
{
    const escreens = require("./screen")

    for(const [key,escreen] of escreens.EScreens)
    {
        for(const audio of escreen.audio)
        {
            audio.stop()
        }
    }
}

module.exports =
{
    audio:EAudio,
    stepUp:EAudioStepUp,
    boost:EAudioBoost,
    stopAll:StopAllAudio
}