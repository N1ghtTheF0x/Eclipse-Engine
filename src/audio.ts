import {EUtils} from "./utils"
var idGiver = 0

const utils: EUtils = new EUtils("audio.ts")

export namespace EAudios
{
    export type EAudioSource = string
    export type EAudioID = number
    export type EAudioAny = EAudio | EAudioAllegro | EAudioBoost | EAudioIntroLoop | EAudioStepUp
    export type EAudioList = (EAudio | EAudioAllegro | EAudioBoost | EAudioIntroLoop | EAudioStepUp)[]
    
    export interface EAudioManager
    {
        
    }
    export class EAudioManager extends Map<EAudioID,EAudioAny>
    {
        constructor(entries?: ([EAudioID,EAudioAny])[])
        {
            super(entries)
        }
        stopAll()
        {
            super.forEach(function(audio)
            {
                audio.stop()
            })
        }
        createEAudio(src: EAudioSource,loop=false): EAudio
        {
            return new EAudio(src,loop)
        }
        createEAudioAllegro(orginal: EAudio,allegroVersion: EAudio): EAudioAllegro
        {
            return new EAudioAllegro(orginal,allegroVersion)
        }
        createEAudioBoost(main: EAudio,fx: EAudio): EAudioBoost
        {
            return new EAudioBoost(main,fx)
        }
        createEAudioIntroLoop(intro: EAudio,loop: EAudio): EAudioIntroLoop
        {
            return new EAudioIntroLoop(intro,loop)
        }
        createEAudioStepUp(EAudioArray: EAudioList): EAudioStepUp
        {
            return new EAudioStepUp(EAudioArray)
        }
    }

    export interface EAudio
    {
        src: EAudioSource
        loop: boolean
        audioContext: AudioContext
        _audio: HTMLAudioElement
        track: MediaElementAudioSourceNode
        stopped: boolean
        id: EAudioID
    }
    export class EAudio
    {
        /**
         * An easy to use Audio Class
         * @param {string} src - Path to audio file (`MP3`|`OGG`|`FLAC`|`WAV`) 
         * @param {boolean} loop - Should the audio loop when finished?
         */
        constructor(src: EAudioSource,loop=false)
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
                utils.print("warn","The Audio from "+src+" got an Error!")
                utils.print("error",error.message+" in "+error.filename+" at Line "+error.lineno+":"+error.colno)
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
                utils.Dprint("Playing "+SRC)
            })
            .catch(function(err)
            {
                utils.print("error","Couldn't play audio: \n\n"+err)
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
                utils.Dprint("Paused "+SRC+" at "+TIME)
                this.stopped=false    
            }
            catch (err)
            {
                utils.print("error","Couldn't pause "+SRC+":\n\n"+err)
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
                utils.Dprint("Stopped "+SRC)
                this.stopped = true
            }
            catch(err)
            {
                utils.print("error","Couldn't stop "+SRC+":\n\n"+err)
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
    export interface EAudioStepUp
    {
        EAudioArray: EAudio[]
        NextToPlay: number
    }
    export class EAudioStepUp extends EAudio
    {
        /**
         * A collection of EAudio Solo Tracks which play together the final product
         * @param {EAudio[]} EAudioArray - An Array of EAudio. `EAudio[0]` Index is the reference
         */
        constructor(EAudioArray: EAudioList)
        {
            super(EAudioArray[0].src,EAudioArray[0].loop)
            this.EAudioArray = EAudioArray
            this.NextToPlay = 1
        }
        /**
         * Play the next track of the audio
         */
        nextToPlay()
        {
            if(this.NextToPlay!==null)
            {
                const eaudio = this.EAudioArray[this.NextToPlay]
                if(!this.isPaused()||!this.stopped)
                {
                    eaudio.play(this._audio.currentTime)
                }
                this.NextToPlay++
                if(!this.EAudioArray[this.NextToPlay])
                {
                    this.NextToPlay = null
                }
            }
        }
        /**
         * Resets the Audio
         */
        reset()
        {
            this.NextToPlay = 1
        }
    }
    
    export interface EAudioBoost
    {
        fx: EAudio
        boosting: boolean
    }
    export class EAudioBoost extends EAudio
    {
        /**
         * Dynamic Music based on Sonic's boost. It's two tracks, one orginal, the other some kind of fast version of it or with phaser and other stuff.
         * @param {EAudio} main - The orginal unmodified Audio
         * @param {EAudio} fx - The modified orginal Audio
         */
        constructor(main: EAudio,fx: EAudio)
        {
            super(main.src,main.loop)
            this.fx = fx
            this.fx._audio.volume=0
            this.boosting = false
        }
        /**
         * Start the Boost Audio
         */
        startBoost()
        {
            this._audio.volume=0
            this.fx._audio.volume=1
            this.boosting = true
        }
        /**
         * Stop the Boost Audio
         */
        stopBoost()
        {
            this._audio.volume=1
            this.fx._audio.volume=0
            this.boosting = false
        }
    }
    export interface EAudioAllegro
    {
        allegroVersion: EAudio
        IsOrginal: boolean
    }
    export class EAudioAllegro extends EAudio
    {
        /**
         * Two Audio: One orginal and the other is a Allegro version of the orginal. Use this if you want some cool Boss music with two Phases
         * @param {EAudio} orginal - The Orignal Audio
         * @param {EAudio} allegroVersion - Fast boy Version of the Orignal Audio
         */
        constructor(orginal: EAudio,allegroVersion: EAudio)
        {
            super(orginal.src,orginal.loop)
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
                this.stop()
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
                this.play()
                this.IsOrginal = true
            }
        }
    }
    export interface EAudioIntroLoop
    {
        IsInLoop: boolean
        Audioloop: EAudio
    }
    export class EAudioIntroLoop extends EAudio
    {
        /**
         * An Audio Track with an Intro and Loop
         * @param {EAudio} intro - The Intro. This is only played once
         * @param {EAudio} loop - The Loop. This is played back and forth
         */
        constructor(intro: EAudio,loop: EAudio)
        {
            super(intro.src,intro.loop)
            this.Audioloop = loop
            this.IsInLoop = false
            var self = this
            this._audio.addEventListener("ended",function()
            {
                self.IsInLoop = true
                self.Audioloop.play()
            })
        }
    }
}

