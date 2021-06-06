import type { Metadata } from '@grpc/grpc-js'
import { get } from 'svelte/store';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore} from '../../stores';
import { EditorDataFlowMode, EditorEventType } from '../components/types/types';
import { GrpcClientManager } from './grpcClientManager';
import type { RpcProtoInfo, ResponseInfo } from './models';

interface RequestInterceptorInput {
    metadata: Metadata,
    requestMessage: Object,
    rpcProtoInfo: RpcProtoInfo,
}

export function requestInterceptor(incomingRequest: RequestInterceptorInput): Promise<ResponseInfo> {
    const responsePromise = new Promise<ResponseInfo>(async (resolve, reject) => {
        const config = get(activeTabConfigStore)

        console.log('Incoming request : ', incomingRequest)
        const transformedRequest = await requestTransformer(incomingRequest)
        console.log('transformedRequest : ', transformedRequest)
        GrpcClientManager.sendRequest({
            metadata: ProtoUtil.stringify(transformedRequest.metadata.getMap()),
            requestMessage: ProtoUtil.stringify(transformedRequest.requestMessage),
            rpcProtoInfo: incomingRequest.rpcProtoInfo,
            url: config.targetGrpcServerUrl,
            onError: (e, metaInfo) => { reject(e) },
            onResponse: (data, metaInfo) => resolve({ data, isStreaming: false, metaInfo })
        })
    });
    return responsePromise;
}


interface RequestTransformerOutput { requestMessage: Object, metadata: Metadata }

async function requestTransformer(request: RequestInterceptorInput): Promise<RequestTransformerOutput> {
    const transformedRequest = await new Promise<RequestTransformerOutput>(async (resolve, reject) => {
        const activeTab = get(activeTabConfigStore)
        if (activeTab.monitorRequestEditorState.dataFlowMode == EditorDataFlowMode.passThrough) {
            resolve(request)
        }
        else if (activeTab.monitorRequestEditorState.dataFlowMode == EditorDataFlowMode.liveEdit) {
            activeTab.monitorRequestEditorState.eventEmitter.on(EditorEventType.editingDone, async () => {
                const newRequestString = get(activeTabConfigStore).monitorRequestEditorState.incomingRequest?.text ?? '{}';
                const newRequestObject = JSON.parse(newRequestString)
                resolve({ metadata: request.metadata, requestMessage: newRequestObject });
            })
        }
    });
    return transformedRequest
}