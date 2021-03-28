import { Metadata, MetadataValue } from "@grpc/grpc-js";
import type { IpcRendererEvent } from "electron/main";
import { requestInterceptor, responseInterceptor } from "../behaviour";
import { IpcChannel, IpcRendererChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { ProtoUtil } from "../../commons/utils";
import { FakerUtil, TabUtil } from "../../commons/utils/util";
import { activeTabConfigStore, appConfigStore, RpcOperationMode, rpcProtoInfosStore } from "../../stores";
import { GrpcClientManager } from "../behaviour/grpcClientManager";
import type { RpcProtoInfo } from "../behaviour/models";
import { get } from "svelte/store";

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
                this.hanldeRequestInMockRpcMode(request, metadataObject, event);
            }
        }
    }

    private async handleRequestInClientMode(request: IpcRequest, metadata: Metadata, event: IpcRendererEvent) {

    }

    private async handleRequestInMonitorMode(request: IpcRequest, metadata: Metadata, event: IpcRendererEvent) {
        const { serviceName, methodName, requestObject }:
            { serviceName: string, methodName: string, requestObject: any } = request.params
        const rpcProtoInfo = await ProtoUtil.getMethodRpc(serviceName, methodName)

        requestInterceptor({
            requestMessage: requestObject,
            metadata,
            rpcProtoInfo
        })
            .then(responseInfo =>
                responseInterceptor({ responseMessage: responseInfo })
            ).then(transformedResponse => {
                event.sender.send(request.responseChannel!, transformedResponse);
            });
    }

    private async hanldeRequestInMockRpcMode(request: IpcRequest, metadata: Metadata, event: IpcRendererEvent) {
        const mockResponse = get(activeTabConfigStore).mockRpcEditorText
        event.sender.send(request.responseChannel!, { data: JSON.parse(mockResponse) })
    }
}

