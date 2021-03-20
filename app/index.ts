import { ipcRenderer } from 'electron';
import App from './App.svelte';
import { RequestHandlerChannel } from './renderer/ipc/ipcRendererChannels';
import type { IpcRendererChannelInterface } from './commons/ipc/ipcChannelInterface';


const app = new App({
	target: document.body,
});

function registerIpcChannels(ipcChannels: IpcRendererChannelInterface[]) {
	ipcChannels.forEach(channel => ipcRenderer.on(channel.getName(), (event, request) => channel.handle(event, request)));
}
registerIpcChannels([new RequestHandlerChannel()])

export default app;