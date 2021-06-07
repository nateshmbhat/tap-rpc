import { IpcChannel } from "../../commons/ipc/ipcChannelInterface"
import type { ResponseInfo } from "../../renderer/behaviour";
import { IpcRendererService } from "./ipcRendererService"

export class RendererProcessInterface {
    static async onRequest(requestObject: any, metadata: any, serviceName: string, methodName: string): Promise<ResponseInfo> {
        const ipcResponse = await IpcRendererService.send<ResponseInfo>(IpcChannel.onRequest, {
            params: {
                requestObject,
                metadata,
                serviceName,
                methodName
            }
        })
        return ipcResponse
    }
}