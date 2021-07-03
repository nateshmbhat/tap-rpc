// @ts-ignore
import * as Store from "electron-store";
import type { AppConfigModel, TabConfigModel } from "../renderer/components/types/types";

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
		appDataDiskStore.set(KEYS.tabs, appConfigModel.tabs)
		appDataDiskStore.set(KEYS.activeTabIndex, appConfigModel.activeTabIndex)
		appDataDiskStore.set(KEYS.defaultTargetServerUrl, appConfigModel.defaultTargetServerUrl)
	}

	static fetchAppData(): AppConfigModel {
		return {
			tabs: appDataDiskStore.get(KEYS.tabs, []),
			activeTabIndex: appDataDiskStore.get(KEYS.defaultTargetServerUrl, 0),
			defaultTargetServerUrl: appDataDiskStore.get(KEYS.defaultTargetServerUrl, 'myserver.com:8080')
		}
	}

	static clear() {
		return appDataDiskStore.clear()
	}
}

abstract class TabModelConverter {
	static serializeModel(tabConfigModel: TabConfigModel) {
		
	}

	static deserializeToModel() {

	}
}