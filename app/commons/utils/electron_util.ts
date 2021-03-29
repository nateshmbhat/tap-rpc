import path from 'path'

export class ElectronUtil {
    static getResourcePath() {
        return process.env.HOT
            ? path.join(__dirname, '../resources')
            : process.resourcesPath
    }

    static isInRendererProcess() {
        return window !== undefined
    }
    static isInMainProcess() {
        return window === undefined
    }

    static getAppIconPath() {
        return process.env.HOT
            ? path.join(__dirname, '../resources/icon.ico')
            : path.join(process.resourcesPath, 'icon.ico')
    }
}
