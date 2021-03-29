import type { Server } from "@grpc/grpc-js";
import { writable } from "svelte/store";
export interface AppConfigModel {
  proxyGrpcServerUrl: string;
  proxyGrpcServer: Server | null;
  testGrpcServer: Server | null;
  testGrpcServerUrl: string;
}

export enum RpcOperationMode {
  mockRpc = 'mockRpc',
  monitor = 'monitor',
  client = 'client',
}

export interface RequestResponseEditorModel {
  requestText: string;
  responseText: string;
}

function createAppConfigStore() {
  const { set, subscribe, update } = writable<AppConfigModel>({
    proxyGrpcServerUrl: '0.0.0.0:50051',
    proxyGrpcServer: null,
    testGrpcServer: null,
    testGrpcServerUrl: '0.0.0.0:9090',
  });

  return {
    subscribe,
    setConfig: (config: AppConfigModel) => set(config),
    setProxyGrpcServerUrl: (url: string) => update((config) => ({ ...config, proxyGrpcServerUrl: url })),
    setProxyGrpcServer: (server: Server) => update((config) => {
      return ({ ...config, proxyGrpcServer: server });
    }),
    setTestGrpcServer: (server: Server) => update((config) => {
      return ({ ...config, testGrpcServer: server });
    }),
    setProtoPaths: (paths: string[]) => update(config => ({ ...config, protoPaths: paths }))
  };
}


export const appConfigStore = createAppConfigStore();
