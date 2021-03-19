import path from 'path'

export class ElectronUtil {
    static getResourcePath() {
        return process.env.HOT
            ? path.join(__dirname, '../resources')
            : process.resourcesPath
    }

    static getAppIconPath() {
        return process.env.HOT
            ? path.join(__dirname, '../resources/icon.ico')
            : path.join(process.resourcesPath, 'icon.ico')
    }
}
