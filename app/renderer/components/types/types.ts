import type { RpcProtoInfo } from "../../behaviour";

export interface RpcSelectorFileType {
    type: 'folder' | 'file';
    name: string;
    //is defined only when type is 'file'
    protoInfo?: RpcProtoInfo;
    files: RpcSelectorFileType[]
}