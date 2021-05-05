import { derived, get, writable } from "svelte/store";
import type { RpcProtoInfo } from "../renderer/behaviour";
import { RpcOperationMode } from "./appConfigStore";
import { EditorEventEmitter } from "../renderer/behaviour/responseStateController";

export interface TabConfigModel {
    id: string;
    selectedRpc: RpcProtoInfo | undefined;
    targetGrpcServerUrl: string;
    rpcOperationMode: RpcOperationMode;
    monitorRequestEditorState: MonitorRequestEditorModel;
    monitorResponseEditorState: MonitorResponseEditorModel;
    clientRequestEditorState: ClientEditorModel;
    clientResponseEditorState: ClientEditorModel;
    mockRpcEditorText: string;
}

export interface ClientEditorModel {
    text: string;
    metadata: string;
}
export interface TabListConfigModel {
    tabs: TabConfigModel[];
    activeTabIndex: number;
}

///Enum only applicable for editor when it "not in client mode"
export enum EditorDataFlowMode {
    passThrough, liveEdit
}

export interface MonitorRequestEditorModel {
    text: string;
    metadata: string;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}

export interface MonitorResponseEditorModel {
    text: string;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}

function getDefaultTabConfig(): TabConfigModel {
    return ({
        id: '0',
        selectedRpc: undefined,
        targetGrpcServerUrl: 'localhost:9090',
        rpcOperationMode: RpcOperationMode.mockRpc,
        monitorRequestEditorState: { text: '', eventEmitter: new EditorEventEmitter(), metadata: '', dataFlowMode: EditorDataFlowMode.passThrough },
        clientRequestEditorState: { text: '{}', metadata: '' },
        monitorResponseEditorState: { text: '', eventEmitter: new EditorEventEmitter(), dataFlowMode: EditorDataFlowMode.passThrough },
        clientResponseEditorState: { text: '', metadata: '' },
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
        setActiveTabRequestEditorState: (requestEditorModel: MonitorRequestEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, monitorRequestEditorState: requestEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabResponseEditorState: (responseEditorModel: MonitorResponseEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, monitorResponseEditorState: responseEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabClientRequestEditorState: (requestEditorModel: ClientEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, clientRequestEditorState: requestEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabClientResponseEditorState: (responseEditorModel: ClientEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, clientResponseEditorState: responseEditorModel }
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
        setSelectedRpc: (rpcInfo: RpcProtoInfo) => {
            console.log("Seleted RPC : ", rpcInfo.methodName)
            return tabListConfigStore.setActiveTabSelectedRpc(rpcInfo);
        },
        setTargetGrpcServerUrl: (url: string) => tabListConfigStore.setActiveTabTargetGrpcServerUrl(url),
        setRpcOperationMode: async (mode: RpcOperationMode) => {
            tabListConfigStore.setActiveTabRpcOperationMode(mode);
        },
        setMonitorRequestEditorState: (editorModel: MonitorRequestEditorModel) => tabListConfigStore.setActiveTabRequestEditorState(editorModel),
        setMonitorResponseEditorState: (editorModel: MonitorResponseEditorModel) => tabListConfigStore.setActiveTabResponseEditorState(editorModel),
        setClientRequestEditorState: (editorModel: ClientEditorModel) => tabListConfigStore.setActiveTabClientRequestEditorState(editorModel),
        setClientResponseEditorState: (editorModel: ClientEditorModel) => tabListConfigStore.setActiveTabClientResponseEditorState(editorModel),
        setMockRpcEditorText: (text: string) => tabListConfigStore.setActiveTabMockRpcEditorText(text),
    };
}


export const activeTabConfigStore = createActiveTabConfigStore();