import type { IpcRenderer } from "electron";
import type { IpcRequest } from "../../commons/ipc/ipcChannelInterface";

//To be used only in renderer process
export class IpcMainService {
    private static ipcRenderer?: IpcRenderer;

    public static send<T>(channel: string, request: IpcRequest): Promise<T> {
        // If the ipcRenderer is not available try to initialize it
        if (!this.ipcRenderer) {
            this.initializeIpcRenderer();
        }
        // If there's no responseChannel let's auto-generate it
        if (!request.responseChannel) {
            request.responseChannel = `${channel}_response_${new Date().getTime()}`
        }

        const ipcRenderer = this.ipcRenderer;
        ipcRenderer?.send(channel, request);
        console.log('Sending ipc request to main channel : ', channel)
        console.dir(request)

        // This method returns a promise which will be resolved when the response has arrived.
        return new Promise(resolve => {
            ipcRenderer?.once(request.responseChannel!, (event, response) => {
                console.log('Got response from main channel : ', channel)
                console.dir(response)
                return resolve(response);
            });
        });
    }

    private static initializeIpcRenderer() {
        if (!window || !window.process || !window.require) {
            throw new Error(`Unable to require renderer process`);
        }
        this.ipcRenderer = window.require('electron').ipcRenderer;
    }
}
