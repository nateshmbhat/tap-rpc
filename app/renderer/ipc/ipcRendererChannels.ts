import { Metadata, MetadataValue } from "@grpc/grpc-js";
import type { IpcRendererEvent } from "electron/main";
import { requestInterceptor, ResponseInfo, responseInterceptor } from "../behaviour";
import { IpcChannel, IpcRendererChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { ProtoUtil } from "../../commons/utils";
import { TabUtil } from "../../commons/utils/util";
import { activeTabConfigStore, RpcOperationMode } from "../../stores";
import { GrpcClientManager } from "../behaviour/grpcClientManager";
import { get } from "svelte/store";
import type { IncomingRequest } from "../components/types/types";

export class RequestHandlerChannel implements IpcRendererChannelInterface {
    getName(): string {
        return IpcChannel.onRequest
    }

    async handle(event: IpcRendererEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        const { serviceName, methodName, requestObject, metadata }:
            { serviceName: string, methodName: string, requestObject: any, metadata: { internalRepr: Map<string, MetadataValue[]> } } = request.params
        const metadataObject = new Metadata();

        metadata.internalRepr.forEach((value, key) => {
            metadataObject.add(key, value[0])
        })

        const rpcProtoInfo = await ProtoUtil.getMethodRpc(serviceName, methodName)
        const activeTabConfig = get(activeTabConfigStore)

        const rpcTab = await TabUtil.getTabConfigFromRpc(rpcProtoInfo)

        if (rpcTab == undefined || activeTabConfig.id != rpcTab.id) {
            GrpcClientManager.sendRequest({
                requestMessage: ProtoUtil.stringify(requestObject),
                metadata: ProtoUtil.stringify(metadataObject),
                rpcProtoInfo,
                url: activeTabConfig.targetGrpcServerUrl,
                onResponse: (data, metaInfo) => event.sender.send(request.responseChannel!, { data: data }),
                onError: (e, metaInfo) => event.sender.send(request.responseChannel!, e)
            })
            return
        }
        if (activeTabConfig.id == rpcTab.id) {
            // rpc call was meant for active tab
            if (activeTabConfig.rpcOperationMode == RpcOperationMode.monitor) {
                this.handleRequestInMonitorMode(request, metadataObject, event);
            }
            else if (activeTabConfig.rpcOperationMode == RpcOperationMode.client) {
                this.handleRequestInClientMode(request, metadataObject, event);
            }
            else if (activeTabConfig.rpcOperationMode == RpcOperationMode.mockRpc) {
                this.handleRequestInMockRpcMode(request, metadataObject, event);
            }
        }
    }

    private async handleRequestInClientMode(request: IpcRequest, metadata: Metadata, event: IpcRendererEvent) {

    }

    private async handleRequestInMonitorMode(request: IpcRequest, metadata: Metadata, event: IpcRendererEvent) {
        const { serviceName, methodName, requestObject }: IncomingRequest = request.params
        const rpcProtoInfo = await ProtoUtil.getMethodRpc(serviceName, methodName)

        requestInterceptor({
            requestMessage: requestObject,
            metadata,
            rpcProtoInfo
        })
            .then(responseInterceptor)
            .then(transformedResponse => {
                event.sender.send(request.responseChannel!, transformedResponse);
            })
            .catch(error => {
                console.table(error)
                event.sender.send(request.responseChannel!, { error: { code: error.code, details: error.details, message: error.message }, data: {}, isStreaming: false, metaInfo: {} } as ResponseInfo);
            });
    }

    private async handleRequestInMockRpcMode(request: IpcRequest, metadata: Metadata, event: IpcRendererEvent) {
        const mockResponse = get(activeTabConfigStore).mockRpcEditorText
        event.sender.send(request.responseChannel!, { data: JSON.parse(mockResponse) })
    }
}

