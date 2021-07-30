import type { IpcMainEvent, IpcRendererEvent } from "electron";

export enum IpcChannel {
    startServer = 'setProtoFiles',
    setProtoImportPaths = 'setProtoImportPaths',
    onRequest = 'onRequest',
    onAppCloseRequest = 'onAppCloseRequest',
    closeElectronApp = 'closeElectronApp'
}

export interface IpcRequest {
    responseChannel?: string;
    params?: any;
}

export interface IpcMainChannelInterface {
    getName(): string;
    handle(event: IpcMainEvent, request: IpcRequest): void;
}

export interface IpcRendererChannelInterface {
    getName(): string;
    handle(event: IpcRendererEvent, request: IpcRequest): void;
}
