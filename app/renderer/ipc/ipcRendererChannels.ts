import { Metadata, MetadataValue } from "@grpc/grpc-js";
import type { IpcRendererEvent } from "electron/main";
import { requestInterceptor, ResponseError, ResponseInfo, responseInterceptor } from "../behaviour";
import { IpcChannel, IpcRendererChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { ProtoUtil } from "../../commons/utils";
import { TabUtil } from "../../commons/utils/util";
import { activeTabConfigStore } from "../../stores";
import { GrpcClientManager } from "../behaviour/grpcClientManager";
import { get } from "svelte/store";
import { IncomingRequest, MonitorConnectionStatus, RpcOperationMode } from "../components/types/types";
import { appConfigStore } from "../../stores/tabStore";

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
            this.relayRequestAndResponse(request, metadataObject, event)
            return
        }
        else if (activeTabConfig.id == rpcTab.id) {
            // rpc call was meant for active tab
            if (activeTabConfig.rpcOperationMode == RpcOperationMode.monitor) {
                this.handleRequestInMonitorMode(request, metadataObject, event);
            }
            else if (activeTabConfig.rpcOperationMode == RpcOperationMode.client) {
                this.relayRequestAndResponse(request, metadataObject, event)
            }
            else if (activeTabConfig.rpcOperationMode == RpcOperationMode.mockRpc) {
                this.handleRequestInMockRpcMode(request, metadataObject, event);
            }
        }
    }

    private async relayRequestAndResponse(request: IpcRequest, metadata: Metadata, event: IpcRendererEvent) {
        const { serviceName, methodName, requestObject }: IncomingRequest = request.params
        const rpcProtoInfo = await ProtoUtil.getMethodRpc(serviceName, methodName)
        const activeConfig = get(activeTabConfigStore)
        GrpcClientManager.sendRequest({
            metadata: ProtoUtil.stringify(metadata.getMap()),
            requestMessage: ProtoUtil.stringify(requestObject),
            rpcProtoInfo,
            url: get(appConfigStore).defaultTargetServerUrl,
            onError: (error: any, metaInfo) => {
                console.table(error)
                event.sender.send(request.responseChannel!, {
                    error: { code: error.code, details: error.details, message: error.message },
                    data: {},
                    isStreaming: false,
                    metaInfo: {}
                } as ResponseInfo);
            },
            onResponse: (data, metaInfo) => event.sender.send(request.responseChannel!,
                { data, isStreaming: false, metaInfo } as ResponseInfo)
        })
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
            .catch((error: ResponseError) => {
                const activeConfig = get(activeTabConfigStore)
                activeTabConfigStore.setMonitorResponseEditorState({
                    ...activeConfig.monitorResponseEditorState,
                    incomingResponseText: ProtoUtil.stringify({ error: error.message })
                })
                console.table(error)
                event.sender.send(request.responseChannel!, { error: { code: error.code, details: error.details, message: error.message }, data: {}, isStreaming: false, metaInfo: {} } as ResponseInfo);
            }).finally(() => {
                const activeConfig = get(activeTabConfigStore)
                activeTabConfigStore.setMonitorResponseEditorState({
                    ...activeConfig.monitorResponseEditorState,
                    connectionStatus: MonitorConnectionStatus.waiting
                })
            });
    }

    private async handleRequestInMockRpcMode(request: IpcRequest, metadata: Metadata, event: IpcRendererEvent) {
        const { error, responseText } = get(activeTabConfigStore).mockRpcEditorState
        if (error === undefined) {
            event.sender.send(request.responseChannel!, { data: JSON.parse(responseText) })
        }
        else {
            event.sender.send(request.responseChannel!, { error: { code: error.code, details: error.details, message: error.details }, data: {}, isStreaming: false, metaInfo: {} } as ResponseInfo);
        }
    }
}

