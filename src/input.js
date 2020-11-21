const util = require("./utils")

class EInput
{
    constructor(WINDOW=window)
    {
        this.window = WINDOW
        this.lastInputDevice = "keyboard"
        this.gameController = this.window.navigator.getGamepads()[0]
        this.cursor =
        {
            x:0,
            y:0,
            clicked:false
        }
        this.controllerPressed=
        {
            joyX1:0,
            joyY1:0,
            joy1:false,
            joyX2:0,
            joyY2:0,
            joy2:false,
            A:false,
            B:false,
            X:false,
            Y:false,
            start:false,
            select:false,
            power:false,
            dup:false,
            dleft:false,
            ddown:false,
            dright:false,
            ls:0,
            lt:0,
            rs:false,
            rt:false
        }
        this.keyboardPressed=
        {
            lastKey:""
        }
    }
    ControllerUpdate()
    {
        const newgamepad = this.window.navigator.getGamepads()[0]
        if(newgamepad)
        {
            this.controllerPressed.A=newgamepad.buttons[0].pressed // A
            this.controllerPressed.B=newgamepad.buttons[1].pressed // B
            this.controllerPressed.X=newgamepad.buttons[2].pressed // X
            this.controllerPressed.Y=newgamepad.buttons[3].pressed // Y

            this.controllerPressed.ls=newgamepad.buttons[4].pressed // Left shoulder
            this.controllerPressed.rs=newgamepad.buttons[5].pressed // right shoulder

            this.controllerPressed.lt=newgamepad.buttons[6].pressed // left trigger
            this.controllerPressed.rt=newgamepad.buttons[7].pressed // right trigger
            
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
            controls.lastInputDevice="keyboard"
            util.Dprint("Player pressed on the Keyboard "+event.code)
            
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
            controls.cursor.clicked=true
        },false)
        this.window.document.addEventListener("onmouseup",function(event)
        {
            event.preventDefault()
            controls.cursor.clicked=false
        },false)
        this.window.document.addEventListener("oncontextmenu",function(event)
        {
            event.preventDefault()
            controls.cursor.rclicked=true
        },false)
    }
}
module.exports = EInput