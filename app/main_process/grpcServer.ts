import * as grpc from '@grpc/grpc-js'
import { AppConfigModel, appConfigStore } from '../stores';
import type { ProtoService } from '../renderer/behaviour';
import { responseInterceptor } from '../renderer/behaviour';
import { ipcRenderer } from 'electron';
import { RendererProcessInterface } from './ipc/ipcRendererProcessInterface';
import { get } from 'svelte/store';

function addGrpcServices(server: grpc.Server | null, serviceProtos: ProtoService[]): void {
  if (server == null) {
    console.warn('Tried to add service when the server is not yet ready !')
    return;
  }
  console.log('service protos : ', serviceProtos)
  serviceProtos.forEach(serviceProto => {
    const serviceImplementation: grpc.UntypedServiceImplementation = {}
    Object.entries(serviceProto.methods).forEach(([methodName, methodRpcInfo]) => {
      serviceImplementation[methodName] = (clientCall: any, callback: grpc.sendUnaryData<any>) => {
        RendererProcessInterface.onRequest(clientCall.request, clientCall.metadata,
          serviceProto.serviceName, methodRpcInfo.methodName).then((response) => {
            console.log('reponse from renderer process : ')
            console.dir(response, { depth: null })
            callback(null, response.message)
          })
      };
    })
    console.log('service proto-implmentation : ', serviceImplementation)
    server.addService(serviceProto.serviceDefinition, serviceImplementation);
  })
}

export const startProxyGrpcServer = async (serviceProtos: ProtoService[]): Promise<void> => {
  const grpcServer = new grpc.Server();
  addGrpcServices(grpcServer, serviceProtos)
  const config = get(appConfigStore)
  if (config.proxyGrpcServer) {
    console.warn('mock server already running. Restarting Server with updated protos');
    config.proxyGrpcServer.forceShutdown();
  }
  grpcServer.bindAsync(config.proxyGrpcServerUrl, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      console.error(error)
    }
    else {
      console.log("Started server at port : ", port)
      grpcServer.start();
      appConfigStore.setProxyGrpcServer(grpcServer)
    }
  });
}
