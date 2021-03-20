import { derived, writable } from "svelte/store";
import type { RpcProtoInfo } from "../renderer/behaviour";
import { RpcOperationMode } from "./appConfigStore";
import { EditorEventEmitter } from "../renderer/behaviour/responseStateController";

export interface TabConfigModel {
    id: string;
    selectedRpc: RpcProtoInfo | undefined;
    targetGrpcServerUrl: string;
    rpcOperationMode: RpcOperationMode;
    requestEditorState: RequestEditorModel;
    responseEditorState: ResponseEditorModel;
    mockRpcEditorText: string;
}

export interface TabListConfigModel {
    tabs: TabConfigModel[];
    activeTabIndex: number;
}

///Enum only applicable for editor when it "not in client mode"
export enum EditorDataFlowMode {
    passThrough, liveEdit
}

export interface RequestEditorModel {
    text: string;
    metadata: string;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}

export interface ResponseEditorModel {
    text: string;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}

function getDefaultTabConfig(): TabConfigModel {
    return ({
        id: '0',
        selectedRpc: undefined,
        targetGrpcServerUrl: 'localhost:50053',
        rpcOperationMode: RpcOperationMode.mockRpc,
        requestEditorState: { text: '', eventEmitter: new EditorEventEmitter(), metadata: '{}', dataFlowMode: EditorDataFlowMode.passThrough },
        responseEditorState: { text: '', eventEmitter: new EditorEventEmitter(), dataFlowMode: EditorDataFlowMode.passThrough },
        mockRpcEditorText: '{}'
    });
}

function createTabListConfigStore() {
    const defaultTabConfig = getDefaultTabConfig();
    const { set, subscribe, update } = writable<TabListConfigModel>({
        activeTabIndex: 0,
        tabs: [defaultTabConfig],
    });
    return {
        subscribe,
        setActiveTab: (index: number) => update((store) => ({ ...store, activeTabIndex: index })),
        setValue: async (tabConfigListModel: TabListConfigModel) => set(tabConfigListModel),
        setActiveTabSelectedRpc: (rpcInfo: RpcProtoInfo) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, selectedRpc: rpcInfo }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabTargetGrpcServerUrl: (url: string) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, targetGrpcServerUrl: url }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabRpcOperationMode: (mode: RpcOperationMode) => update(config => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, rpcOperationMode: mode }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabRequestEditorState: (requestEditorModel: RequestEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, requestEditorState: requestEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabResponseEditorState: (responseEditorModel: ResponseEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, responseEditorState: responseEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabMockRpcEditorText: (text: string) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, mockRpcEditorText: text }
            return { ...config, tabs: allTabs }
        }),
        addNewTab: () => update((config) => {
            const allTabs = Array.from(config.tabs)
            const newTab = { ...getDefaultTabConfig(), id: allTabs.length.toString() }
            allTabs.push(newTab)
            return { ...config, tabs: allTabs }
        }),
        removeTab: (index: number) => update((config) => {
            const allTabs = Array.from(config.tabs)
            let newActiveTab = config.activeTabIndex
            if (allTabs.length == 1) return config
            allTabs.splice(index, 1)
            if (config.activeTabIndex >= allTabs.length) newActiveTab = config.activeTabIndex--;
            return { ...config, tabs: allTabs }
        })
    };
}

export const tabListConfigStore = createTabListConfigStore()

function createActiveTabConfigStore() {
    const { subscribe } = derived(tabListConfigStore, (configStore) => {
        return configStore.tabs[configStore.activeTabIndex]
    })

    return {
        subscribe,
        getValue: async () => new Promise<TabConfigModel>((res, rej) => subscribe(config => res(config))()),
        setSelectedRpc: (rpcInfo: RpcProtoInfo) => {
            console.log("Seleted RPC : ", rpcInfo.methodName)
            return tabListConfigStore.setActiveTabSelectedRpc(rpcInfo);
        },
        setTargetGrpcServerUrl: (url: string) => tabListConfigStore.setActiveTabTargetGrpcServerUrl(url),
        setRpcOperationMode: async (mode: RpcOperationMode) => {
            tabListConfigStore.setActiveTabRpcOperationMode(mode);
        },
        setRequestEditorState: (editorModel: RequestEditorModel) => tabListConfigStore.setActiveTabRequestEditorState(editorModel),
        setResponseEditorState: (editorModel: ResponseEditorModel) => tabListConfigStore.setActiveTabResponseEditorState(editorModel),
        setMockRpcEditorText: (text: string) => tabListConfigStore.setActiveTabMockRpcEditorText(text),
    };
}


export const activeTabConfigStore = createActiveTabConfigStore();

function createRequestResponseEditorStore() {
    const { subscribe } = derived(activeTabConfigStore, (configStore) => {
        return {
            request: configStore.requestEditorState,
            response: configStore.responseEditorState,
            metadata: configStore.requestEditorState.metadata,
        }
    })

    return {
        subscribe,
        setRequest: async (text: string) => {
            const tabConfig = await activeTabConfigStore.getValue()
            activeTabConfigStore.setRequestEditorState({ ...tabConfig.requestEditorState, text })
        },
        setMetadata: async (text: string) => {
            const tabConfig = await activeTabConfigStore.getValue()
            activeTabConfigStore.setRequestEditorState({ ...tabConfig.requestEditorState, metadata: text })
        },
        setResponse: async (text: string) => {
            const tabConfig = await activeTabConfigStore.getValue()
            activeTabConfigStore.setResponseEditorState({ ...tabConfig.responseEditorState, text })
        },
    };
}

export const requestResponseEditorStore = createRequestResponseEditorStore();