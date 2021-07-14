import { derived, writable } from "svelte/store";
import type { Certificate, RpcProtoInfo } from "../renderer/behaviour";
import immer from "immer";
import { AppDataDiskStore, getDefaultTabConfig } from "../disk_storage/appDataDiskStorage";
import type { AppConfigModel, TabConfigModel, RpcOperationMode, MonitorRequestEditorModel, MonitorResponseEditorModel, ClientEditorModel, MockRpcEditorModel } from "../renderer/components/types/types";


function createAppConfigStore() {
    const { set, subscribe, update } = writable<AppConfigModel>(AppDataDiskStore.fetchAppData());
    return {
        subscribe,
        setActiveTab: (index: number) => update((store) => ({ ...store, activeTabIndex: index })),
        setValue: async (appConfigModel: AppConfigModel) => set(appConfigModel),
        setDefaultTargetServerUrl: (targetServer: string) => update(store => {
            return ({ ...store, defaultTargetServerUrl: targetServer });
        }),
        setTabValue: (newTabConfig: TabConfigModel, tabId: string) => update((store) => {
            return immer(store, (draftStore) => {
                for (let [index, tabConfig] of draftStore.tabs.entries()) {
                    if (tabConfig.id === tabId) {
                        draftStore.tabs[index] = newTabConfig;
                    }
                }
            })
        }),
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
        setActiveTabMonitorRequestEditorState: (requestEditorModel: MonitorRequestEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, monitorRequestEditorState: requestEditorModel }
            return { ...config, tabs: allTabs }
        }),
        setActiveTabMonitorResponseEditorState: (responseEditorModel: MonitorResponseEditorModel) => update((config) => {
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
        setActiveTabMockRpcEditorModel: (editorModel: MockRpcEditorModel) => update((config) => {
            const activeTab = config.tabs[config.activeTabIndex]
            const allTabs = Array.from(config.tabs)
            allTabs[config.activeTabIndex] = { ...activeTab, mockRpcEditorState: editorModel }
            return { ...config, tabs: allTabs }
        }),
        addNewTab: () => update((config) => {
            const allTabs = Array.from(config.tabs)
            const newTabConfig = getDefaultTabConfig()
            if (allTabs.length > 0) {
                newTabConfig.clientRequestEditorState.metadata = allTabs[0].clientRequestEditorState.metadata
            }
            const newTab = { ...newTabConfig, id: allTabs.length.toString() }
            allTabs.push(newTab)
            return { ...config, tabs: allTabs, activeTabIndex: allTabs.length - 1 }
        }),
        setTlsCertificate: (tlsCertificate: Certificate | undefined) => update((config) => {
            const allTabs = Array.from(config.tabs)
            const activeTab = config.tabs[config.activeTabIndex]
            allTabs[config.activeTabIndex] = { ...activeTab, tlsCertificate }
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

export const appConfigStore = createAppConfigStore()

function createActiveTabConfigStore() {
    const { subscribe } = derived(appConfigStore, (configStore) => {
        return configStore.tabs[configStore.activeTabIndex]
    })

    return {
        subscribe,
        setSelectedRpc: (rpcInfo: RpcProtoInfo) => {
            console.log("Seleted RPC : ", rpcInfo.methodName)
            return appConfigStore.setActiveTabSelectedRpc(rpcInfo);
        },
        setTargetGrpcServerUrl: (url: string) => appConfigStore.setActiveTabTargetGrpcServerUrl(url),
        setRpcOperationMode: async (mode: RpcOperationMode) => {
            appConfigStore.setActiveTabRpcOperationMode(mode);
        },
        setMonitorRequestEditorState: (editorModel: MonitorRequestEditorModel) => appConfigStore.setActiveTabMonitorRequestEditorState(editorModel),
        setTlsCertificate: (tlsCertificate: Certificate | undefined) => appConfigStore.setTlsCertificate(tlsCertificate),
        setMonitorResponseEditorState: (editorModel: MonitorResponseEditorModel) => appConfigStore.setActiveTabMonitorResponseEditorState(editorModel),
        setClientRequestEditorState: (editorModel: ClientEditorModel) => appConfigStore.setActiveTabClientRequestEditorState(editorModel),
        setClientResponseEditorState: (editorModel: ClientEditorModel) => appConfigStore.setActiveTabClientResponseEditorState(editorModel),
        setMockRpcEditorState: (editorModel: MockRpcEditorModel) => appConfigStore.setActiveTabMockRpcEditorModel(editorModel),
    };
}


export const activeTabConfigStore = createActiveTabConfigStore();