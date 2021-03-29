import { IpcChannel } from "../../commons/ipc/ipcChannelInterface"
import { IpcMainService } from "./ipcMainService"

export class MainProcessInterface {
    static startServer<T>(protoFilePaths: string[]): Promise<T> {
        return IpcMainService.send<T>(IpcChannel.startServer, {
            params: {
                protoFilePaths
            }
        })
    }

    static setProtoImportPaths<T>(folderPaths: string[]): Promise<T> {
        return IpcMainService.send<T>(IpcChannel.setProtoImportPaths, {
            params: {
                folderPaths
            }
        })
    }
}
