import type { Certificate, GRPCEventEmitter, RpcProtoInfo } from "../../behaviour";
import type { EditorEventEmitter } from "../../behaviour/responseStateController";

export enum MonitorConnectionStatus {
    //waiting for incoming data
    waiting,

    //connection alive. Data on hold
    onHold
}

export interface MockRpcEditorModel {
    responseText: string;
    error?: {
        code: number,
        details: string,
    }
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
    mockRpcEditorState: MockRpcEditorModel;
}

export interface ClientEditorModel {
    text: string;
    metadata: string;
    requestCallEventEmitter?: GRPCEventEmitter;
}
export interface AppConfigModel {
    tabs: TabConfigModel[];
    activeTabIndex: number;
    defaultTargetServerUrl: string;
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