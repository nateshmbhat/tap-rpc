import { GRPCEventType, GRPCRequest, ResponseMetaInformation } from ".";
import type { RpcProtoInfo } from "./models";


type OnResponse = (response: object, metaInfo: ResponseMetaInformation) => void
type OnError = (error: Error, metaInfo: ResponseMetaInformation) => void
type OnCallEnd = () => void

class GrpcClientManager {
    static sendRequest = ({ requestMessage, metadata = '{}', url, rpcProtoInfo, onResponse, onError, onCallEnd }:
        { requestMessage: string, metadata: string, url: string, rpcProtoInfo: RpcProtoInfo, onResponse?: OnResponse, onError?: OnError, onCallEnd?: OnCallEnd }) => {
        const grpcRequest = new GRPCRequest({
            inputs: requestMessage,
            metadata,
            url,
            rpcProtoInfo
        });

        grpcRequest.on(GRPCEventType.ERROR, (e: Error, metaInfo: ResponseMetaInformation) => {
            console.error('GRPC ERROR EVENT : ', e, metaInfo);
            if (onError) onError(e, metaInfo)
        });

        grpcRequest.on(GRPCEventType.DATA, (data: object, metaInfo: ResponseMetaInformation) => {
            if (metaInfo.stream) {
                //TODO : handle streaming call
            } else {
                if (onResponse) onResponse(data, metaInfo)
            }
        });

        grpcRequest.on(GRPCEventType.END, () => {
            console.warn('GRPC End Event');
        });

        try {
            grpcRequest.send();
        } catch (e) {
            console.error(e);
            grpcRequest.emit(GRPCEventType.END);
            if (onCallEnd) onCallEnd()
        }
    }
}

export {GrpcClientManager}