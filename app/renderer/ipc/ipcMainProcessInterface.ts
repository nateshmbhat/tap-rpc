import { IpcChannel } from "../../commons/ipc/ipcChannelInterface"
import { IpcMainService } from "./ipcMainService"

export class MainProcessInterface {
    static importProtoFromMainProcess<T>(protoFilePaths: string[], resolvePaths: string[] = []): Promise<T> {
        return IpcMainService.send<T>(IpcChannel.importProto, {
            params: {
                protoFilePaths, resolvePaths
            }
        })
    }

    static startProxyGrpcServer<T>(serverUrl: string): Promise<T> {
        return IpcMainService.send<T>(IpcChannel.startProxyGrpcServer, {
            params: { serverUrl }
        })
    }
}
