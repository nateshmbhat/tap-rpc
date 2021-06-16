import type { Certificate, RpcProtoInfo } from "../../behaviour";
import type { EditorEventEmitter } from "../../behaviour/responseStateController";

export enum MonitorConnectionStatus {
    //waiting for incoming data
    waiting,

    //connection alive. Data on hold
    onHold
}

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


export enum RpcOperationMode {
    mockRpc = 'mockRpc',
    monitor = 'monitor',
    client = 'client',
}

///Enum only applicable for editor when it "not in client mode"
export enum EditorDataFlowMode {
    passThrough, liveEdit
}


export interface MonitorRequestEditorModel {
    incomingRequest?: IncomingRequest
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
    connectionStatus: MonitorConnectionStatus;
}

export interface MonitorResponseEditorModel {
    incomingResponseText?: string;
    eventEmitter: EditorEventEmitter;
    dataFlowMode: EditorDataFlowMode;
    connectionStatus: MonitorConnectionStatus;
}

export interface RpcSelectorFileType {
    type: 'folder' | 'file';
    name: string;
    //is defined only when type is 'file'
    protoInfo?: RpcProtoInfo;
    files: RpcSelectorFileType[]
}

export interface IncomingRequest {
    serviceName: string,
    methodName: string,
    requestObject: any
    text: string;
    metadata: string;
}