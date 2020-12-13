const util = require("./utils")
const EGame = require("./game")
var idGiver = 0
class EAudio
{
    /**
     * An easy to use Audio Class
     * @param {string} src - Path to audio file (`MP3`|`OGG`|`FLAC`|`WAV`) 
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
    /**
     * A collection of EAudio which play together a final Audio
     * @param {EAudio[]} EAudioArray - An Array of EAudio. First Index is the refrence
     */
    constructor(EAudioArray=[new EAudio()])
    {
        this.EAudioArray = EAudioArray
        this.refrence = this.EAudioArray[0]
        this.NextToPlay = 1

    }
    /**
     * Play the refrence (First Item in the array)
     * @param {number} ms - Where to strart?
     */
    play(ms=0)
    {
        this.refrence.play(ms)
    }
    /**
     * Play the next track of the audio
     */
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
    /**
     * Dynamic Music based on Sonic's boost. It's based on two tracks, one orginal, the other some kind of fast version of it.
     * @param {EAudio} main - The orginal unmodified Audio
     * @param {EAudio} fx - The modified orginal Audio
     */
    constructor(main=new EAudio(),fx=new EAudio())
    {
        this.main = main
        this.fx = fx
        this.fx._audio.volume=0
        this.boosting = false
    }
    /**
     * Start the Boost Audio
     */
    startBoost()
    {
        this.main._audio.volume=0
        this.fx._audio.volume=1
        this.boosting = true
    }
    /**
     * Stop the Boost Audio
     */
    stopBoost()
    {
        this.main._audio.volume=1
        this.fx._audio.volume=0
        this.boosting = false
    }
    /**
     * Play both Audio at the same time
     * @param {number} ms - Where to Start?
     */
    play(ms=0)
    {
        this.main.play(ms)
        this.fx.play(ms)
        this.boosting = false
    }
    /**
     * Pause both Audio at the same time
     */
    pause()
    {
        this.main.pause()
        this.fx.pause()
        this.boosting = false
    }
    /**
     * Stop both Audio at the same time
     */
    stop()
    {
        this.main.stop()
        this.fx.stop()
        this.boosting = false
    }
}
class EAudioAllegro
{
    /**
     * Two Audio: One orginal and the other is a Allegro version of the orginal. Use this if you want Boss music
     * @param {EAudio} orginal 
     * @param {EAudio} allegroVersion 
     */
    constructor(orginal=new EAudio(),allegroVersion=new EAudio())
    {
        this.orginal = orginal
        this.allegroVersion = allegroVersion
        this.IsOrginal = true
    }
    /**
     * Switch to Allegro version
     */
    playAllegro()
    {
        if(this.IsOrginal)
        {
            this.orginal.stop()
            this.allegroVersion.play()
            this.IsOrginal = false
        }
    }
}
class EAudioIntroLoop
{
    constructor(intro=new EAudio(),loop=new EAudio())
    {
        this.intro = intro
        this.loop = loop
    }
}
/**
 * Stops all Audio currently playing if it gets too loud
 */
function StopAllAudio(game=new EGame())
{
    const escreens = game.screenmanager.map

    for(const [key,escreen] of escreens)
    {
        for(const audio of escreen.audio)
        {
            if(audio instanceof EAudio)
            {
                audio.stop()
            }
            else if(audio instanceof EAudioStepUp)
            {
                for(const Aaudio of audio.EAudioArray)
                {
                    Aaudio.stop()
                }
            }
            else if(audio instanceof EAudioBoost)
            {
                audio.stop()
            }
            else if(audio instanceof EAudioAllegro)
            {
                audio.orginal.stop()
                audio.allegroVersion.stop()
            }
            else if(audio instanceof EAudioIntroLoop)
            {
                audio.intro.stop()
                audio.loop.stop()
            }
        }
    }
}

module.exports =
{
    audio:EAudio,
    stepUp:EAudioStepUp,
    boost:EAudioBoost,
    stopAll:StopAllAudio,
    allegro:EAudioAllegro,
    introloop:EAudioIntroLoop
}