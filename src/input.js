const util = require("./utils")

class EMouse
{
    /**
     * The User's Mouse. Here's the position of the mouse based on the window and if clicked a button
     */
    constructor()
    {
        this.x = 0
        this.y = 0
        this.w = 1
        this.h = 1
        this.left = false
        this.right = false
        this.middle = false
        this.forward = false
        this.backward = false
        this.ButtonIndex = 0
    }
}

class EController
{
    /**
     * The User's Controller
     */
    constructor()
    {
        this.gp = window.navigator.getGamepads()[0]
        // Left Joystick
        this.joyX1=0
        this.joyY1=0
        this.joy1=false
        // Right Joystick
        this.joyX2=0
        this.joyY2=0
        this.joy2=false
        // Right Buttons
        this.A=false
        this.B=false
        this.X=false
        this.Y=false
        // Main Buttons
        this.start=false
        this.select=false
        this.power=false
        // Directional Pads
        this.dup=false
        this.dleft=false
        this.ddown=false
        this.dright=false
        // Left back buttons
        this.ls=0
        this.lt=0
        this.ltP=false
        // right back buttons
        this.rs=false
        this.rt=false
        this.rtP=false
    }
}

class EKeyboard
{
    /**
     * The User's Keyboard. To get an key use the property as `event.code`
     */
    constructor()
    {
        this.lastKey = ""
        this.plusALT = false
        this.plusCTRL = false
        this.any = false
    }
}

class EInput
{
    /**
     * Handles Input like Keyboard, Mice and XInput Controllers
     * @param {window} WINDOW - The `window` Object
     */
    constructor(WINDOW)
    {
        this.window = WINDOW
        this.lastInputDevice = "Keyboard"
        this.HasGameController = typeof this.window.navigator.getGamepads()[0]!=="undefined"
        this.cursor = new EMouse()
        this.controllersPressed=[new EController(),new EController(),new EController(),new EController()]
        this.keyboardPressed=new EKeyboard()
    }
    /**
     * Updates the controller object
     * @param {0|1|2|3} controller - The Index of the Controller. Only 0-3 (Controller 1-4)
     */
    ControllerUpdate(controller)
    {
        this.HasGameController = (typeof this.window.navigator.getGamepads()[controller]!="undefined")
        if(this.HasGameController)
        {
            this.lastInputDevice="Gamepad"
            if(this.window.navigator.getGamepads()[controller])
            {
                this.controllersPressed[controller].gp=this.window.navigator.getGamepads()[controller]
                this.controllersPressed[controller].A=this.window.navigator.getGamepads()[controller].buttons[0].pressed // A
                this.controllersPressed[controller].B=this.window.navigator.getGamepads()[controller].buttons[1].pressed // B
                this.controllersPressed[controller].X=this.window.navigator.getGamepads()[controller].buttons[2].pressed // X
                this.controllersPressed[controller].Y=this.window.navigator.getGamepads()[controller].buttons[3].pressed // Y
    
                this.controllersPressed[controller].ls=this.window.navigator.getGamepads()[controller].buttons[4].pressed // Left shoulder
                this.controllersPressed[controller].rs=this.window.navigator.getGamepads()[controller].buttons[5].pressed // right shoulder
    
                this.controllersPressed[controller].lt=this.window.navigator.getGamepads()[controller].buttons[6].value // left trigger
                this.controllersPressed[controller].rt=this.window.navigator.getGamepads()[controller].buttons[7].value // right trigger
                
                this.controllersPressed[controller].select=this.window.navigator.getGamepads()[controller].buttons[8].pressed // select/back
                this.controllersPressed[controller].start=this.window.navigator.getGamepads()[controller].buttons[9].pressed // start/forward
    
                this.controllersPressed[controller].joy1=this.window.navigator.getGamepads()[controller].buttons[10].pressed // Left Joystick Press
                this.controllersPressed[controller].joy2=this.window.navigator.getGamepads()[controller].buttons[11].pressed // Right Joystick Press
    
                this.controllersPressed[controller].dup=this.window.navigator.getGamepads()[controller].buttons[12].pressed // Dpad Up
                this.controllersPressed[controller].ddown=this.window.navigator.getGamepads()[controller].buttons[13].pressed // Dpad Down
                this.controllersPressed[controller].dleft=this.window.navigator.getGamepads()[controller].buttons[14].pressed // Dpad Left
                this.controllersPressed[controller].dright=this.window.navigator.getGamepads()[controller].buttons[15].pressed // Dpad Right
    
                this.controllersPressed[controller].power=this.window.navigator.getGamepads()[controller].buttons[16].pressed // Xbox Button/PS Button/Power Button
    
                this.controllersPressed[controller].joyX1=this.window.navigator.getGamepads()[controller].axes[0] // Left Joystick X-Position
                this.controllersPressed[controller].joyY1=this.window.navigator.getGamepads()[controller].axes[1] // Left Joystick Y-Position
    
                this.controllersPressed[controller].joyX2=this.window.navigator.getGamepads()[controller].axes[2] // Right Joystick X-Position
                this.controllersPressed[controller].joyY2=this.window.navigator.getGamepads()[controller].axes[3] // Right Joystick Y-Position
            }
        }
    }
    /**
     * Starts the Input Listener. Needs Itself as Parameter
     * @param {EInput} controls - The `EInput` Object itself 
     */
    Init(controls)
    {
        this.window.addEventListener("keydown",function(event)
        {
            event.preventDefault()
            controls.any=true
            controls.keyboardPressed[event.code]=true
            controls.keyboardPressed.plusALT=event.altKey
            controls.keyboardPressed.plusCTRL=event.ctrlKey
            controls.keyboardPressed.lastKey=event.code
            this.lastInputDevice = "Keyboard"
            
        },false)
        this.window.addEventListener("keyup",function(event)
        {
            event.preventDefault()
            controls.keyboardPressed.any=false
            controls.keyboardPressed[event.code]=false
        },false)
        this.window.addEventListener("mousemove",function(event)
        {
            event.preventDefault()
            controls.cursor.x=event.pageX
            controls.cursor.y=event.pageY
        },false)
        this.window.addEventListener("onmousedown",function(event)
        {
            event.preventDefault()
            controls.cursor.ButtonIndex=event.button
            if(event.button)
            {
                if(event.button===0) // Left Click
                {
                    controls.cursor.left=true
                }
                if(event.button===1) // Middle Wheel Click
                {
                    controls.cursor.middle=true
                }
                if(event.button===2) // right click
                {
                    controls.cursor.right=true
                }
                if(event.button===3) // side button up
                {
                    controls.cursor.forward=true
                }
                if(event.button===4) // side button down
                {
                    controls.cursor.backward=true
                }
            }
        },false)
        this.window.addEventListener("onmouseup",function(event)
        {
            event.preventDefault()
            if(event.button)
            {
                if(event.button===0) // Left Click
                {
                    controls.cursor.left=false
                }
                if(event.button===1) // Middle Wheel Click
                {
                    controls.cursor.middle=false
                }
                if(event.button===2) // right click
                {
                    controls.cursor.right=false
                }
                if(event.button===3) // side button up
                {
                    controls.cursor.forward=false
                }
                if(event.button===4) // side button down
                {
                    controls.cursor.backward=false
                }
            }
        },false)
        util.print("info","Started Input")
    }

}
module.exports = EInput