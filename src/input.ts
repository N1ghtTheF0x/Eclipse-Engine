import {EUtils} from "./utils"

const utils: EUtils = new EUtils("input.ts")

interface EMouse
{
    x: number
    y: number
    w: number
    h: number
    left: boolean
    right: boolean
    middle: boolean
    forward: boolean
    backward: boolean
    ButtonIndex: number
}
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

interface EControllerJoystick
{
    x: number
    y: number
    pressed: boolean
}
interface EControllerDpad
{
    up: boolean
    down: boolean
    right: boolean
    left: boolean
}

interface EController
{
    gp: Gamepad
    joy1: EControllerJoystick
    joy2: EControllerJoystick
    A: boolean
    B: boolean
    X: boolean
    Y: boolean
    start: boolean
    select: boolean
    power: boolean
    dpad: EControllerDpad
    ls: boolean
    lt: number
    ltP: boolean
    rs: boolean
    rt: number
    rtP: boolean
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
        this.joy1 = {x:0,y:0,pressed:false}
        // Right Joystick
        this.joy2 = {x:0,y:0,pressed:false}
        this.A=false
        this.B=false
        this.X=false
        this.Y=false
        // Main Buttons
        this.start=false
        this.select=false
        this.power=false
        // Directional Pads
        this.dpad = {left: false,right: false,up: false,down: false}
        // Left back buttons
        this.ls=false
        this.lt=0
        this.ltP=false
        // right back buttons
        this.rs=false
        this.rt=0
        this.rtP=false
    }
}


interface EKeyboard
{
    lastKey: string
    plusALT: boolean
    plusCTRL: boolean
    any: boolean
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

export interface EInput
{
    window: Window
    lastInputDevice: "Keyboard" | "Controller"
    HasGameController: boolean
    cursor: EMouse
    controllersPressed: [EController,EController,EController,EController]
    keyboard: EKeyboard
}
export class EInput
{
    /**
     * Handles Input like Keyboard, Mice and XInput Controllers
     * @param {window} WINDOW - The `window` Object
     */
    constructor(WINDOW: Window)
    {
        this.window = WINDOW
        this.lastInputDevice = "Keyboard"
        this.HasGameController = false
        this.cursor = new EMouse()
        this.controllersPressed=[new EController(),new EController(),new EController(),new EController()]
        this.keyboard=new EKeyboard()
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
            this.lastInputDevice="Controller"
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
    
                this.controllersPressed[controller].joy1.pressed=this.window.navigator.getGamepads()[controller].buttons[10].pressed // Left Joystick Press
                this.controllersPressed[controller].joy2.pressed=this.window.navigator.getGamepads()[controller].buttons[11].pressed // Right Joystick Press
    
                this.controllersPressed[controller].dpad.up=this.window.navigator.getGamepads()[controller].buttons[12].pressed // Dpad Up
                this.controllersPressed[controller].dpad.down=this.window.navigator.getGamepads()[controller].buttons[13].pressed // Dpad Down
                this.controllersPressed[controller].dpad.left=this.window.navigator.getGamepads()[controller].buttons[14].pressed // Dpad Left
                this.controllersPressed[controller].dpad.right=this.window.navigator.getGamepads()[controller].buttons[15].pressed // Dpad Right
    
                this.controllersPressed[controller].power=this.window.navigator.getGamepads()[controller].buttons[16].pressed // Xbox Button/PS Button/Power Button
    
                this.controllersPressed[controller].joy1.x=this.window.navigator.getGamepads()[controller].axes[0] // Left Joystick X-Position
                this.controllersPressed[controller].joy1.y=this.window.navigator.getGamepads()[controller].axes[1] // Left Joystick Y-Position
    
                this.controllersPressed[controller].joy2.x=this.window.navigator.getGamepads()[controller].axes[2] // Right Joystick X-Position
                this.controllersPressed[controller].joy2.y=this.window.navigator.getGamepads()[controller].axes[3] // Right Joystick Y-Position
            }
        }
    }
    /**
     * Starts the Input Listener. Needs Itself as Parameter
     * @param {EInput} controls - The `EInput` Object itself 
     */
    Init(controls: EInput)
    {
        this.window.addEventListener("keydown",function(event)
        {
            event.preventDefault()
            controls.keyboard.any=true
            controls.keyboard[event.code]=true
            controls.keyboard.plusALT=event.altKey
            controls.keyboard.plusCTRL=event.ctrlKey
            controls.keyboard.lastKey=event.code
            controls.lastInputDevice = "Keyboard"
            
        },false)
        this.window.addEventListener("keyup",function(event)
        {
            event.preventDefault()
            controls.keyboard.any=false
            controls.keyboard[event.code]=false
        },false)
        this.window.addEventListener("mousemove",function(event)
        {
            event.preventDefault()
            controls.cursor.x=event.pageX
            controls.cursor.y=event.pageY
        },false)
        utils.print("info","Started Input")
    }

}