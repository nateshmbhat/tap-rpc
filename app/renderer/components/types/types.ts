import type { RpcOperationMode } from "../../../stores";
import type { Certificate, RpcProtoInfo } from "../../behaviour";
import type { EditorEventEmitter } from "../../behaviour/responseStateController";

export interface TabConfigModel {
    id: string;
    selectedRpc: RpcProtoInfo | undefined;
    targetGrpcServerUrl: string;
    rpcOperationMode: RpcOperationMode;
    monitorRequestEditorState: MonitorRequestEditorModel;
    monitorResponseEditorState: MonitorResponseEditorModel;
    tlsCertificate?: Certificate,
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


export interface IncomingResponse {
    text: string;
}

export interface MonitorRequestEditorModel {
    incomingRequest?: IncomingRequest
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}

export interface MonitorResponseEditorModel {
    incomingResponse?: IncomingResponse;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
}

export interface RpcSelectorFileType {
    type: 'folder' | 'file';
    name: string;
    //is defined only when type is 'file'
    protoInfo?: RpcProtoInfo;
    files: RpcSelectorFileType[]
}

export const enum EditorEventType {
    loadedMessageToEditor = "loadedMessageToEditor",
    editingDone = "editingDone",
};

export interface IncomingRequest {
    serviceName: string,
    methodName: string,
    requestObject: any
    text: string;
    metadata: string;
}