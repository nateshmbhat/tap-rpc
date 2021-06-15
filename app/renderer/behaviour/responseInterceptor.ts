
import { get } from 'svelte/store';
import { ProtoUtil } from '../../commons/utils';
import { activeTabConfigStore, appConfigStore, RpcOperationMode } from '../../stores';
import { EditorDataFlowMode, MonitorConnectionStatus } from '../components/types/types';
import type { ResponseInfo, RpcProtoInfo } from './models';
import { EditorEventType } from './responseStateController';


export async function responseInterceptor(responseMessage: ResponseInfo): Promise<ResponseInfo> {
    const activeTabConfig = get(activeTabConfigStore)

    activeTabConfigStore.setMonitorResponseEditorState({
        ...activeTabConfig.monitorResponseEditorState,
        connectionStatus: MonitorConnectionStatus.onHold,
        incomingResponseText: ProtoUtil.stringify(responseMessage.data)
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
                const newResponseString = get(activeTabConfigStore).monitorResponseEditorState.incomingResponseText ?? '{}'
                const newResponseObject = JSON.parse(newResponseString)
                resolve({ ...transformerInput.response, data: newResponseObject });
            })
        }
    });
    return transformedResponse
}