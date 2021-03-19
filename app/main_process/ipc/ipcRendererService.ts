import { BrowserWindow, ipcMain, IpcRenderer } from "electron";
import type { IpcRequest } from "../../commons/ipc/ipcChannelInterface";

//To be used only in main process
export class IpcRendererService {
    public static send<T>(channel: string, request: IpcRequest): Promise<T> {
        // If there's no responseChannel let's auto-generate it
        if (!request.responseChannel) {
            request.responseChannel = `${channel}_response_${new Date().getTime()}`
        }
        const allWindows = BrowserWindow.getAllWindows()
        const window = allWindows[0]
        window?.webContents.send(channel, request)
        console.log('Sending ipc request to renderer channel : ', channel)
        console.dir(request)

        // This method returns a promise which will be resolved when the response has arrived.
        return new Promise(resolve => {
            ipcMain?.once(request.responseChannel!, (event, response) => {
                console.log('Got response from renderer channel : ', channel)
                console.dir(response)
                return resolve(response);
            });
        });
    }
}