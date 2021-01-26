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
    constructor(src,loop=false)
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
        this._audio = new Audio(this.src)
        this._audio.addEventListener("error",function(error)
        {
            util.print("warn","The Audio from "+src+" got an Error!")
            util.print("error",error.message+" in "+error.filename+" at Line "+error.lineno+":"+error.colno)
        })
        this.track = this.audioContext.createMediaElementSource(this._audio)
        this.track.connect(this.audioContext.destination)
        this._audio.loop=this.loop
        /**
         * Has the audio stopped by the `stop` function?
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
        const SRC = this.src
        try
        {
            
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
        const SRC = this.src
        try
        {
            
            this._audio.pause()
            this._audio.currentTime=0
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
     * @returns {boolean}
     */
    isPaused()
    {
        return this._audio.paused
    }
}

class EAudioStepUp
{
    /**
     * A collection of EAudio Solo Tracks which play together the final product
     * @param {EAudio[]} EAudioArray - An Array of EAudio. `EAudio[0]` Index is the reference
     */
    constructor(EAudioArray)
    {
        this.EAudioArray = EAudioArray
        this.reference = this.EAudioArray[0]
        this.NextToPlay = 1

    }
    /**
     * Play the reference (First Item in the array)
     * @param {number} ms - Where to strart?
     */
    play(ms=0)
    {
        this.reference.play(ms)
    }
    /**
     * Play the next track of the audio
     */
    nextToPlay()
    {
        if(this.NextToPlay!==null)
        {
            const eaudio = this.EAudioArray[this.NextToPlay]
            if(!this.reference.isPaused()||!this.reference.stopped)
            {
                eaudio.play(this.reference._audio.currentTime)
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
     * Dynamic Music based on Sonic's boost. It's two tracks, one orginal, the other some kind of fast version of it or with phaser and other stuff.
     * @param {EAudio} main - The orginal unmodified Audio
     * @param {EAudio} fx - The modified orginal Audio
     */
    constructor(main,fx)
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
     * Two Audio: One orginal and the other is a Allegro version of the orginal. Use this if you want some cool Boss music with two Phases
     * @param {EAudio} orginal - The Orignal Audio
     * @param {EAudio} allegroVersion - Fast boy Version of the Orignal Audio
     */
    constructor(orginal,allegroVersion)
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
    /**
     * Reverts back to the Orignal version
     */
    revert()
    {
        if(!this.IsOrginal)
        {
            this.allegroVersion.stop()
            this.orginal.play()
            this.IsOrginal = true
        }
    }
}
class EAudioIntroLoop
{
    /**
     * An Audio Track with an Intro and Loop
     * @param {EAudio} intro - The Intro. This is only played once
     * @param {EAudio} loop - The Loop. This is played back and forth
     */
    constructor(intro,loop)
    {
        this.intro = intro
        this.loop = loop
        this.IsInLoop = false
        var self = this
        this.intro._audio.addEventListener("ended",function()
        {
            self.IsInLoop = true
            self.loop.play()
        })
    }
    /**
     * Starts playing
     */
    start()
    {
        this.intro.play()
    }
}
/**
 * Stops all Audio currently playing if it gets too loud or weird
 * @param {EGame} game - The `EGame` Object
 */
function StopAllAudio(game)
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
    EAudio,
    EAudioStepUp,
    EAudioBoost,
    StopAllAudio,
    EAudioAllegro,
    EAudioIntroLoop
}