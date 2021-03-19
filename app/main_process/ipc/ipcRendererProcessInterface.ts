import { IpcChannel } from "../../commons/ipc/ipcChannelInterface"
import { IpcRendererService } from "./ipcRendererService"

interface TransformedResponse {
    message: Object
}

export class RendererProcessInterface {
    static async onRequest(requestObject: any, metadata: any, serviceName: string, methodName: string): Promise<TransformedResponse> {
        const ipcResponse = await IpcRendererService.send<{ data: Object }>(IpcChannel.onRequest, {
            params: {
                requestObject,
                metadata,
                serviceName,
                methodName
            }
        })
        return { message: ipcResponse.data };
    }
}