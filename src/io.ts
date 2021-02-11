import {EUtils} from "./utils"
import * as fs from "fs"
import * as path from "path"

const utils: EUtils = new EUtils("io.ts")

export class EIOManager
{
    constructor()
    {

    }
    /**
     * Reads the file an returns it as an `Base64` string
     * @param {string} path - Path to the File
     * @returns {string}
     */
    ReadFileInBase64(path: string): string
    {
        return fs.readFileSync(path,{encoding:"base64"})
    }
    /**
     * Loads an Image from path
     * @param {"png"|"jpeg"} type - The type of image
     * @param {string} path - Path to the Image
     * @returns {HTMLImageElement}
     */
    LoadImage(type: "png" | "jpeg",path: string): HTMLImageElement
    {
        const img = new Image()
        const src = "data:image/"+type+";base64,"+this.ReadFileInBase64(path)
        img.addEventListener("error",function(err)
        {
            utils.print("error","Error at image from "+path+":\n\n"+err)
        })
        img.src = src
        return img
    }
    /**
     * Loads an Image from path the old way
     * @param {string} path - Path to the Image
     * @returns {HTMLImageElement}
     */
    LoadImageOld(path: string): HTMLImageElement
    {
        const img = new Image()
        img.addEventListener("error",function(err)
        {
            utils.print("error","Error at image from "+path+":\n\n"+err)
        })
        img.src = path
        return img
    }
    PathResolve(...pathSegments: string[]): string
    {
        const PATH = pathSegments.join(path.sep)
        return path.resolve(PATH)
    }
    FileExists(path: fs.PathLike): boolean
    {
        return fs.existsSync(path)
    }
}