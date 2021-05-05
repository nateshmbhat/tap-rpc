import type { Metadata } from '@grpc/grpc-js'
import { get } from 'svelte/store';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore } from '../../stores';
import { EditorDataFlowMode } from '../../stores/tabStore';
import { GrpcClientManager } from './grpcClientManager';
import type { RpcProtoInfo, ResponseInfo } from './models';
import { EditorEventType } from './responseStateController';

interface RequestInterceptorCallback {
    metadata: Metadata,
    requestMessage: Object,
    rpcProtoInfo: RpcProtoInfo,
}


export function requestInterceptor({ metadata, requestMessage, rpcProtoInfo }: RequestInterceptorCallback): Promise<ResponseInfo> {
    const responsePromise = new Promise<ResponseInfo>(async (resolve, reject) => {
        const config = get(activeTabConfigStore)
        console.log('metadata : ', metadata)
        console.log('request message : ', requestMessage)
        console.log('rpc protoInfo : ', rpcProtoInfo)
        activeTabConfigStore.setMonitorRequestEditorState({
            ...config.monitorRequestEditorState,
            metadata: ProtoUtil.stringify(metadata.getMap()),
            text: ProtoUtil.stringify(requestMessage)
        })
        const transformedRequest = await requestTransformer({ metadata, requestMessage })
        console.log('transformedRequest : ', transformedRequest)
        GrpcClientManager.sendRequest({
            metadata: ProtoUtil.stringify(transformedRequest.metadata.getMap()),
            requestMessage: ProtoUtil.stringify(transformedRequest.requestMessage),
            rpcProtoInfo,
            url: config.targetGrpcServerUrl,
            onError: (e, metaInfo) => { reject(e) },
            onResponse: (data, metaInfo) => resolve({ data, isStreaming: false, metaInfo })
        })
    });
    return responsePromise;
}


interface RequestTransformerInput { requestMessage: Object, metadata: Metadata }
interface RequestTransformerOutput { requestMessage: Object, metadata: Metadata }

async function requestTransformer(request: RequestTransformerInput): Promise<RequestTransformerOutput> {
    const transformedRequest = await new Promise<RequestTransformerOutput>(async (resolve, reject) => {
        const activeTab = get(activeTabConfigStore)
        if (activeTab.monitorRequestEditorState.dataFlowMode == EditorDataFlowMode.passThrough) {
            resolve(request)
        }
        else if (activeTab.monitorRequestEditorState.dataFlowMode == EditorDataFlowMode.liveEdit) {
            activeTab.monitorRequestEditorState.eventEmitter.on(EditorEventType.editingDone, async () => {
                const newRequestString = get(activeTabConfigStore).monitorRequestEditorState.text;
                const newRequestObject = JSON.parse(newRequestString)
                resolve({ metadata: request.metadata, requestMessage: newRequestObject });
            })
        }
    });
    return transformedRequest
}