import * as grpc from '@grpc/grpc-js'
import { AppConfigModel, appConfigStore } from '../../../stores';
import type { ProtoService } from '../../behaviour';
import { responseInterceptor } from '../../behaviour';
import { ipcRenderer } from 'electron';

function addGrpcServices(server: grpc.Server | null, serviceProtos: ProtoService[]): void {
    if (server == null) {
        console.warn('Tried to add service when the server is not yet ready !')
        return;
    }
    serviceProtos.forEach(serviceProto => {
        const serviceImplementation: grpc.UntypedServiceImplementation = {}
        Object.entries(serviceProto.methods).forEach(([methodName, methodRpcInfo]) => {
            serviceImplementation[methodName] = (clientCall: any, callback: grpc.sendUnaryData<any>) => {
                callback(null, methodRpcInfo.mockResponsePayload.message)
            };
        })
        server.addService(serviceProto.serviceDefinition, serviceImplementation);
    })
}


export const startTestGrpcServer = async (serviceProtos: ProtoService[]): Promise<void> => {
    const grpcServer = new grpc.Server();
    addGrpcServices(grpcServer, serviceProtos)
    const config = await appConfigStore.getValue()
    if (config.testGrpcServer) {
        console.warn('test server already running. Restarting Server with updated protos');
        config.testGrpcServer.forceShutdown();
    }
    grpcServer.bindAsync(config.testGrpcServerUrl, grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
            console.error(error)
        }
        else {
            console.log("Started test grpc server at port : ", port)
            grpcServer.start();
            appConfigStore.setTestGrpcServer(grpcServer)
        }
    });
}