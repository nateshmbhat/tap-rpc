// @ts-ignore
import * as Store from "electron-store";
import { get } from "svelte/store";
import { ProtoUtil } from "../commons/utils";
import type { Certificate, RpcProtoInfo } from "../renderer/behaviour";
import { EditorEventEmitter } from "../renderer/behaviour/responseStateController";
import { AppConfigModel, EditorDataFlowMode, MockRpcEditorModel, MonitorConnectionStatus, RpcOperationMode, TabConfigModel } from "../renderer/components/types/types";
import { protoFilesStore } from "../stores";


export function getDefaultTabConfig(): TabConfigModel {
	return ({
		id: '0',
		selectedRpc: undefined,
		targetGrpcServerUrl: 'localhost:9090',
		rpcOperationMode: RpcOperationMode.monitor,
		monitorRequestEditorState: {
			connectionStatus: MonitorConnectionStatus.waiting,
			eventEmitter: new EditorEventEmitter(), dataFlowMode: EditorDataFlowMode.passThrough
		},
		clientRequestEditorState: { text: '{}', metadata: '' },
		monitorResponseEditorState: {
			connectionStatus: MonitorConnectionStatus.waiting,
			eventEmitter: new EditorEventEmitter(), dataFlowMode: EditorDataFlowMode.passThrough
		},
		clientResponseEditorState: { text: '', metadata: '' },
		mockRpcEditorState: { responseText: '{}' }
	});
}

const appDataDiskStore = new Store({
	name: "appDataDiskStore",
});

const KEYS = {
	tabs: 'tabs',
	activeTabIndex: 'activeTabIndex',
	defaultTargetServerUrl: 'defaultTargetServerUrl'
};

export abstract class AppDataDiskStore {
	static storeAppData(appConfigModel: AppConfigModel) {
		const serializedTabs = appConfigModel.tabs.map(tabModel => TabModelConverter.serializeModel(tabModel))
		console.log('seraizlied tabs = ', serializedTabs)
		appDataDiskStore.set(KEYS.tabs, serializedTabs)
		appDataDiskStore.set(KEYS.activeTabIndex, appConfigModel.activeTabIndex)
		appDataDiskStore.set(KEYS.defaultTargetServerUrl, appConfigModel.defaultTargetServerUrl)
	}

	static fetchAppData(): AppConfigModel {
		const defaultTabConfig = getDefaultTabConfig();
		const tabsSavedData: SerializedTabConfigModel[] | undefined = appDataDiskStore.get(KEYS.tabs)
		console.log('saved tabs = ', tabsSavedData)
		return {
			tabs: tabsSavedData !== undefined ? tabsSavedData.map(t => TabModelConverter.deserializeToModel(t)) : [defaultTabConfig],
			activeTabIndex: appDataDiskStore.get(KEYS.activeTabIndex, 0),
			defaultTargetServerUrl: appDataDiskStore.get(KEYS.defaultTargetServerUrl, defaultTabConfig.targetGrpcServerUrl)
		}
	}

	static clear() {
		return appDataDiskStore.clear()
	}
}

interface SerializedTabConfigModel {
	selectedProto: ({
		protoFileName?: string;
		fullServiceName?: string;
		methodName?: string;
	}),
	id: string;
	targetGrpcServerUrl: string;
	rpcOperationMode: RpcOperationMode;
	// monitorRequestEditorState: MonitorRequestEditorModel;
	// monitorResponseEditorState: MonitorResponseEditorModel;
	tlsCertificate?: Certificate,
	clientRequestEditorState: {
		text: string;
		metadata: string;
	};
	clientResponseEditorState: {
		text: string;
		metadata: string;
	};
	mockRpcEditorState: MockRpcEditorModel;
}

abstract class TabModelConverter {
	static serializeModel(tabConfigModel: TabConfigModel): SerializedTabConfigModel {
		return {
			id: tabConfigModel.id,
			mockRpcEditorState: tabConfigModel.mockRpcEditorState,
			rpcOperationMode: tabConfigModel.rpcOperationMode,
			targetGrpcServerUrl: tabConfigModel.targetGrpcServerUrl,
			tlsCertificate: tabConfigModel.tlsCertificate,
			selectedProto: {
				methodName: tabConfigModel.selectedRpc?.methodName,
				fullServiceName: tabConfigModel.selectedRpc?.fullServiceName,
				protoFileName: tabConfigModel.selectedRpc?.protoFileName,
			},
			clientRequestEditorState: { ...tabConfigModel.clientRequestEditorState },
			clientResponseEditorState: { ...tabConfigModel.clientResponseEditorState },
		}
	}

	static deserializeToModel(serializedTabConfig: SerializedTabConfigModel): TabConfigModel {
		const selectedRpcInfo = serializedTabConfig.selectedProto
		const allProtoFiles = get(protoFilesStore)
		let services = allProtoFiles.find((file) => file.fileName === selectedRpcInfo.protoFileName)?.services
		let selectedRpc: RpcProtoInfo | undefined
		if (services !== undefined) {
			selectedRpc = Object.values(services).find(s => s.fullServiceName === selectedRpcInfo.fullServiceName)?.methods[selectedRpcInfo.methodName!]
		}
		const defaultTabConfig = getDefaultTabConfig()
		return {
			...defaultTabConfig,
			selectedRpc,
			clientRequestEditorState: serializedTabConfig.clientRequestEditorState,
			clientResponseEditorState: serializedTabConfig.clientResponseEditorState,
			id: serializedTabConfig.id,
			mockRpcEditorState: serializedTabConfig.mockRpcEditorState,
			rpcOperationMode: serializedTabConfig.rpcOperationMode,
			targetGrpcServerUrl: serializedTabConfig.targetGrpcServerUrl,
			tlsCertificate: serializedTabConfig.tlsCertificate,
		}
	}
}