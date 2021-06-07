import { Certificate, GRPCEventType, GRPCRequest, ResponseMetaInformation } from ".";
import type { RpcProtoInfo } from "./models";
import type { GRPCEventEmitter } from "./sendRequest";


type OnResponse = (response: object, metaInfo: ResponseMetaInformation) => void
type OnError = (error: Error, metaInfo: ResponseMetaInformation) => void
type OnCallEnd = () => void

class GrpcClientManager {
    static sendRequest = ({ requestMessage, metadata = '{}', url, rpcProtoInfo, onResponse, onError, onCallEnd, tlsCertificate }:
        {
            requestMessage: string, metadata: string, url: string, rpcProtoInfo: RpcProtoInfo, onResponse?: OnResponse, onError?: OnError, onCallEnd?: OnCallEnd,
            tlsCertificate?: Certificate
        }) => {
        const grpcRequest: GRPCEventEmitter = new GRPCRequest({
            inputs: requestMessage,
            metadata,
            url,
            rpcProtoInfo,
            tlsCertificate
        });

        grpcRequest.on(GRPCEventType.ERROR, (e: Error, metaInfo: ResponseMetaInformation) => {
            console.warn('GRPC ERROR EVENT : ', e, metaInfo);
            if (onError) onError(e, metaInfo)
        });

        grpcRequest.on(GRPCEventType.DATA, (data: object, metaInfo: ResponseMetaInformation) => {
            if (metaInfo.stream) {
                //TODO : handle streaming call
            } else {
                console.info('GRPC Response DATA Event : ')
                console.info({ data, metaInfo }, { depth: null })
                if (onResponse) onResponse(data, metaInfo)
            }
        });

        grpcRequest.on(GRPCEventType.END, () => {
            console.info('GRPC End Event');
            if (onCallEnd) onCallEnd()
        });

        try {
            grpcRequest.send();
        } catch (e) {
            console.error(e);
            grpcRequest.emit(GRPCEventType.END);
        }
    }
}

export { GrpcClientManager }