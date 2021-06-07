
import type { Metadata } from '@grpc/grpc-js'
import type { Http2CallStream } from '@grpc/grpc-js/build/src/call-stream';
import { get } from 'svelte/store';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore, appConfigStore, RpcOperationMode } from '../../stores';
import { EditorDataFlowMode} from '../components/types/types';
import type { ResponseInfo, RpcProtoInfo } from './models';
import { EditorEventType } from './responseStateController';

interface ResponseInterceptorCallback {
    responseMessage: ResponseInfo
}

export async function responseInterceptor({ responseMessage }: ResponseInterceptorCallback): Promise<ResponseInfo> {
    const activeTabConfig = get(activeTabConfigStore)

    activeTabConfigStore.setMonitorResponseEditorState({
        ...activeTabConfig.monitorResponseEditorState,
        incomingResponse: {
            ...activeTabConfig.monitorRequestEditorState.incomingRequest,
            text: ProtoUtil.stringify(responseMessage.data)
        },
    })

    const transformedResponse = await transformResponse({ response: responseMessage })
    return transformedResponse
}

interface ResponseTransformerInput { response: ResponseInfo }

async function transformResponse(transformerInput: ResponseTransformerInput): Promise<ResponseInfo> {
    const transformedResponse = await new Promise<ResponseInfo>(async (resolve, reject) => {
        const activeTab = get(activeTabConfigStore)
        if (activeTab.monitorResponseEditorState.dataFlowMode == EditorDataFlowMode.passThrough) {
            resolve(transformerInput.response)
        }
        else if (activeTab.monitorResponseEditorState.dataFlowMode == EditorDataFlowMode.liveEdit) {
            activeTab.monitorResponseEditorState.eventEmitter.on(EditorEventType.editingDone, async () => {
                const newResponseString = get(activeTabConfigStore).monitorResponseEditorState.incomingResponse?.text ?? '{}'
                const newResponseObject = JSON.parse(newResponseString)
                resolve({ ...transformerInput.response, data: newResponseObject });
            })
        }
    });
    return transformedResponse
}