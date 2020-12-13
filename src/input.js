const util = require("./utils")

class EMouse
{
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
    constructor()
    {
        this.joyX1=0
        this.joyY1=0
        this.joy1=false
        this.joyX2=0
        this.joyY2=0
        this.joy2=false
        this.A=false
        this.B=false
        this.X=false
        this.Y=false
        this.start=false
        this.select=false
        this.power=false
        this.dup=false
        this.dleft=false
        this.ddown=false
        this.dright=false
        this.ls=0
        this.lt=0
        this.rs=false
        this.rt=false
    }
}

class EKeyboard
{
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
    constructor(WINDOW=window)
    {
        this.window = WINDOW
        this.lastInputDevice = "Keyboard"
        this.gameController = this.window.navigator.getGamepads()[0]
        this.cursor = new EMouse()
        this.controllerPressed=new EController()
        this.keyboardPressed=new EKeyboard()
    }
    ControllerUpdate()
    {
        const newgamepad = this.window.navigator.getGamepads()[0]
        if(newgamepad)
        {
            this.lastInputDevice="Gamepad"
            this.controllerPressed.A=newgamepad.buttons[0].pressed // A
            this.controllerPressed.B=newgamepad.buttons[1].pressed // B
            this.controllerPressed.X=newgamepad.buttons[2].pressed // X
            this.controllerPressed.Y=newgamepad.buttons[3].pressed // Y

            this.controllerPressed.ls=newgamepad.buttons[4].pressed // Left shoulder
            this.controllerPressed.rs=newgamepad.buttons[5].pressed // right shoulder

            this.controllerPressed.lt=newgamepad.buttons[6].value // left trigger
            this.controllerPressed.rt=newgamepad.buttons[7].value // right trigger
            
            this.controllerPressed.select=newgamepad.buttons[8].pressed // select/back
            this.controllerPressed.start=newgamepad.buttons[9].pressed // start/forward

            this.controllerPressed.joy1=newgamepad.buttons[10].pressed // Left Joystick Press
            this.controllerPressed.joy2=newgamepad.buttons[11].pressed // Right Joystick Press

            this.controllerPressed.dup=newgamepad.buttons[12].pressed // Dpad Up
            this.controllerPressed.ddown=newgamepad.buttons[13].pressed // Dpad Down
            this.controllerPressed.dleft=newgamepad.buttons[14].pressed // Dpad Left
            this.controllerPressed.dright=newgamepad.buttons[15].pressed // Dpad Right

            this.controllerPressed.power=newgamepad.buttons[16].pressed // Xbox Button/PS Button/Power Button


            this.controllerPressed.joyX1=newgamepad.axes[0] // Left Joystick X-Position
            this.controllerPressed.joyY1=newgamepad.axes[1] // Left Joystick Y-Position

            this.controllerPressed.joyX2=newgamepad.axes[2] // Right Joystick X-Position
            this.controllerPressed.joyY2=newgamepad.axes[3] // Right Joystick Y-Position
        }
    }
    Init(controls=new EInput())
    {
        this.window.document.addEventListener("keydown",function(event)
        {
            event.preventDefault()
            controls.any=true
            controls.keyboardPressed[event.code]=true
            controls.keyboardPressed.plusALT=event.altKey
            controls.keyboardPressed.plusCTRL=event.ctrlKey
            controls.keyboardPressed.lastKey=event.code
            this.lastInputDevice = "Keyboard"
            
        },false)
        this.window.document.addEventListener("keyup",function(event)
        {
            event.preventDefault()
            controls.keyboardPressed.any=false
            controls.keyboardPressed[event.code]=false
        },false)
        this.window.document.addEventListener("mousemove",function(event)
        {
            event.preventDefault()
            controls.cursor.x=event.clientX
            controls.cursor.y=event.clientY
        },false)
        this.window.document.addEventListener("onmousedown",function(event)
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
        this.window.document.addEventListener("onmouseup",function(event)
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