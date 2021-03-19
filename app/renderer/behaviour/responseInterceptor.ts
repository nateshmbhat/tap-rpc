
import type { Metadata } from '@grpc/grpc-js'
import type { Http2CallStream } from '@grpc/grpc-js/build/src/call-stream';
import { get } from 'svelte/store';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore, appConfigStore, RpcOperationMode, requestResponseEditorStore } from '../../stores';
import { EditorDataFlowMode } from '../../stores/tabStore';
import type { ResponseInfo, RpcProtoInfo } from './models';
import { EditorEventType } from './responseStateController';
import { GRPCEventType, GRPCRequest, ResponseMetaInformation } from './sendRequest';

interface ResponseInterceptorCallback {
    responseMessage: ResponseInfo
}

export async function responseInterceptor({ responseMessage }: ResponseInterceptorCallback): Promise<ResponseInfo> {
    requestResponseEditorStore.setResponse(ProtoUtil.stringify(responseMessage.data))
    const transformedResponse = await transformResponse({ response: responseMessage })
    return transformedResponse
}

interface ResponseTransformerInput { response: ResponseInfo }

async function transformResponse(transformerInput: ResponseTransformerInput): Promise<ResponseInfo> {
    const transformedResponse = await new Promise<ResponseInfo>(async (resolve, reject) => {
        const activeTab = await activeTabConfigStore.getValue()
        if (activeTab.responseEditorState.dataFlowMode == EditorDataFlowMode.passThrough) {
            resolve(transformerInput.response)
        }
        else if (activeTab.responseEditorState.dataFlowMode == EditorDataFlowMode.liveEdit) {
            activeTab.responseEditorState.eventEmitter.on(EditorEventType.editingDone, async () => {
                const newResponseString = get(requestResponseEditorStore).response.text
                const newResponseObject = JSON.parse(newResponseString)
                resolve({ ...transformerInput.response, data: newResponseObject });
            })
        }
    });
    return transformedResponse
}