"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EObjects = void 0;
const utils_1 = require("./utils");
var idGiver = 0;
const utils = new utils_1.EUtils("objects.ts");
var EObjects;
(function (EObjects) {
    function CreateEObject(x, y, w, h, type, spritesheet) {
        return new EObject(x, y, w, h, type, spritesheet);
    }
    EObjects.CreateEObject = CreateEObject;
    function CreateEObjectPlayer(x, y, w, h, spritesheet) {
        return new EObjectPlayer(x, y, w, h, spritesheet);
    }
    EObjects.CreateEObjectPlayer = CreateEObjectPlayer;
    class EAnimation {
        constructor(sx, sy, sw, sh) {
            this.sx = sx;
            this.sy = sy;
            this.sw = sw;
            this.sh = sh;
        }
    }
    EObjects.EAnimation = EAnimation;
    class EHitbox {
        /**
         * The EHitbox. Used for Collision detection
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         */
        constructor(x, y, w, h) {
            this.left = x;
            this.right = x + w;
            this.top = y;
            this.bottom = y + h;
        }
    }
    EObjects.EHitbox = EHitbox;
    class EObjectClass {
        /**
         * The EObjectClass. It's the main framework for every object in this Game Engine
         * @param {number} x - X Position | any value
         * @param {number} y - Y Position | any value
         * @param {number} w - Width | any value
         * @param {number} h - Height | any value
         * @param {number} type - The type of object like player, object, enemy, hazard and so on
         */
        constructor(x, y, w, h, type) {
            /**
             * X Position
             */
            this.x = x;
            this._x = this.x;
            this.mx = this.x;
            /**
             * Y Position
             */
            this.y = y;
            this._y = this.y;
            this.my = this.y;
            /**
             * Z Position? *ok...*
             */
            this.z = 1;
            this._z = this.z;
            this.mz = this.z;
            /**
             * Width
             */
            this.w = w;
            this._w = this.w;
            /**
             * Height
             */
            this.h = h;
            this._h = this.h;
            /**
             * X-Speed
             */
            this.xsp = 0;
            /**
             * Y-Speed
             */
            this.ysp = 0;
            /**
             * Ground-Speed
             */
            this.gsp = 0;
            /**
             * Type
             */
            this.type = type;
            this.rotation = [0, 1];
            this.scale = 1;
            this.translation = [0, 0];
            /**
             * ID
             */
            this.id = idGiver;
            idGiver++;
        }
        /**
         * Returns a `EHitbox` of this Object
         */
        GetHitbox() {
            return new EHitbox(this.x, this.y, this.w, this.h);
        }
    }
    EObjects.EObjectClass = EObjectClass;
    class EObject extends EObjectClass {
        /**
         * The EObject to represent a Thing
         * @param {number} x - X Position
         * @param {number} y - Y Position
         * @param {number} w - Width
         * @param {number} h - Height
         * @param {string} type - Type
         * @param {string} spritesheet - Path to spritesheet
         * @hardware
         */
        constructor(x, y, w, h, type, spritesheet) {
            super(x, y, w, h, type);
            /**
             * The Path to the spritesheet
             */
            this.spritesheet = spritesheet;
            /**
             * Has the EObject caught an Error?
             */
            this.error = false;
            this._image = new Image();
            this._image.src = this.spritesheet;
            this._image.addEventListener("error", function (err) {
                utils.print("error", "Error at image from " + spritesheet + ":\n\n" + err.type + ": " + err.message);
            });
            this.dw = this.w * 2;
            this.dh = this.h * 2;
            /**
             * Source X of Picture
             */
            this.sx = 0;
            /**
             * Source Y of Picture
             */
            this.sy = 0;
            /**
             * Source Width of Picture
             */
            this.sw = this.dw;
            /**
             * Source Height of Picture
             */
            this.sh = this.dh;
            this._canvas = document.createElement("canvas");
            this._canvas.height = this.dh;
            this._canvas.width = this.dw;
            this._ctx = this._canvas.getContext("2d");
            this._ctx.imageSmoothingEnabled = false;
            this.scale = 1;
            /**
             * A array containing various animations. Keep in mind you have to add the animations yourself using the `AddAnimation` function
             * @type {EAnimation[]}
             */
            this.animation = [];
            /**
             * Use to calcute when to use which animation
             */
            this.animationTimer = 0;
            /**
             * The current index of the animation array
             */
            this.curAnimation = 0;
        }
        /**
         * Add a animation to the EObject
         * @param {number} sx - Source X
         * @param {number} sy - Source Y
         * @param {number} sw - Source Width
         * @param {number} sh - Source Height
         */
        AddAnimation(sx, sy, sw, sh) {
            const obj = new EAnimation(sx, sy, sw, sh);
            this.animation.push(obj);
            return obj;
        }
        /**
         * Sets the animation to the EObject by Index. Also returns it if valid
         * @param {number} index - The Index of the animation
         * @software
         */
        SetAnimation(index) {
            if (this.animation[index]) {
                const aniObj = this.animation[index];
                this.sx = aniObj.sx;
                this.sy = aniObj.sy;
                this.sw = aniObj.sw;
                this.sh = aniObj.sh;
                this.w = aniObj.sw;
                this.h = aniObj.sh;
                return aniObj;
            }
            else {
                utils.print("warn", "Animation Index " + index + " does no exist on EObject " + this.id + "!");
                return null;
            }
        }
        /**
         * Rotates the Image.
         * @param {number} deg - Degrees to rotate
         * @hardware
         * @software
         */
        rotate(deg) {
            const radian = deg * Math.PI / 180;
            this._ctx.clearRect(0, 0, this._w, this._h);
            this._ctx.translate(this._canvas.width / 2, this._canvas.height / 2);
            this._ctx.rotate(radian);
            this._ctx.translate(-1 * (this._canvas.width / 2), -1 * (this._canvas.height / 2));
            const SINUS = Math.sin(radian);
            const COSINUS = Math.cos(radian);
            this.rotation = [SINUS, COSINUS];
        }
        /**
         * Translates the Image
         * @param {number} x - X-Offset
         * @param {number} y - Y-Offset
         * @hardware
         */
        translate(x, y) {
            this.translation = [x, y];
        }
    }
    EObjects.EObject = EObject;
    class EObjectNet extends EObjectClass {
        /**
         * Just like `EObject` but NodeJS-friendly
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @param {string} type
         * @param {string} spritesheet
         */
        constructor(x, y, w, h, type, spritesheet) {
            super(x, y, w, h, type);
            this.spritesheet = spritesheet;
        }
        /**
         * Converts this to an real `EObject`
         * @returns {EObject}
         */
        normalize() {
            const eobject = new EObject(this.x, this.y, this.w, this.h, this.type, this.spritesheet);
            const obj = Object.assign(Object.assign({}, this), eobject);
            return obj;
        }
    }
    EObjects.EObjectNet = EObjectNet;
    class EObjectPlayer extends EObject {
        /**
         * The Player Object. This should only exist once!
         * @param {number} x - X Position
         * @param {number} y - Y Position
         * @param {number} w - Width
         * @param {number} h - Height
         * @param {string} spritesheet - Path to the stylesheet
         * @software
         * @hardware
         */
        constructor(x, y, w, h, spritesheet) {
            super(x, y, w, h, "player", spritesheet);
            /**
             * Is the player jumping at the moment?
             */
            this.jumping = false;
            /**
             * Is the player on the ground? This value can even be false sometimes if he's on the ground
             */
            this.ground = false;
            /**
             * Which direction the player is facing?
             * @type {"none"|"left"|"right"|"up"|"down"}
             */
            this.facing = null;
            /**
             * Got the Player hit by something like an enemy or hazard?
             */
            this.hit = false;
            /**
             * Can the player move around with keyboard or controller? Can be set to disable/enable player controls
             */
            this.canMove = true;
            /**
             * For Multiplayer
             */
            this.name = "";
            /**
             * If `true` the player will ignore collision
             */
            this.ignoreCollision = false;
            /**
             * Turns the player into a GOD!
             */
            this.godmode = false;
        }
    }
    EObjects.EObjectPlayer = EObjectPlayer;
    class ETile extends EAnimation {
        constructor(sx, sy, sw, sh) {
            super(sx, sy, sw, sh);
        }
    }
    EObjects.ETile = ETile;
    class ETileset {
        /**
         * A Tileset to contruct the levels floor, ceiling and walls
         * @param {number} w - Width of one tile
         * @param {number} h - Height of one tile
         * @param {string} tilesheet - Path to the tilesheet
         */
        constructor(w, h, tilesheet) {
            /**
             * The width of one single tile
             */
            this.w = w;
            /**
             * The height of one single tile
             */
            this.h = h;
            /**
             * The path to the tilesheet
             */
            this.tilesheet = tilesheet;
            this._image = new Image();
            this._image.src = this.tilesheet;
            this._image.addEventListener("error", function (err) {
                utils.print("error", "Error at image from " + tilesheet + ":\n\n" + err.type + ": " + err.message);
            });
            /**
             * All the possible tiles this tilesheets has. You need to add them yourself with `setTile`
             */
            this.tiles = [];
        }
        /**
         * Adds a new tile to the tilesheet
         * @param {number} x - X Position in the tilesheet
         * @param {number} y - Y Position in the tilesheet
         */
        setTile(x, y) {
            const obj = new ETile(x, y, this.w, this.h);
            this.tiles.push(obj);
            return obj;
        }
        /**
         * Turns the tile in the `tiles` array to a EObject
         * @param {number} index - The Index in the array
         * @param {number} x - X Position
         * @param {number} y - Y Position
         */
        toEObject(index, x, y) {
            const tile = this.tiles[index];
            const eobject = new EObject(x, y, this.w, this.h, "object", this.tilesheet);
            eobject.AddAnimation(tile.sx, tile.sy, tile.sw, tile.sh);
            eobject.SetAnimation(1);
            return eobject;
        }
    }
    EObjects.ETileset = ETileset;
})(EObjects = exports.EObjects || (exports.EObjects = {}));
