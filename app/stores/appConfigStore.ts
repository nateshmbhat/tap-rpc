import type { Server } from "@grpc/grpc-js";
import { writable } from "svelte/store";
export interface MainProcessAppConfigModel {
  proxyGrpcServerUrl: string;
  proxyGrpcServer: Server | null;
  testGrpcServer: Server | null;
  testGrpcServerUrl: string;
}

export interface RequestResponseEditorModel {
  requestText: string;
  responseText: string;
}

function createAppConfigStore() {
  const { set, subscribe, update } = writable<MainProcessAppConfigModel>({
    proxyGrpcServerUrl: '0.0.0.0:50051',
    proxyGrpcServer: null,
    testGrpcServer: null,
    testGrpcServerUrl: '0.0.0.0:9090',
  });

  return {
    subscribe,
    setConfig: (config: MainProcessAppConfigModel) => set(config),
    setProxyGrpcServerUrl: (url: string) => update((config) => ({ ...config, proxyGrpcServerUrl: url })),
    setProxyGrpcServer: (server: Server) => update((config) => {
      return ({ ...config, proxyGrpcServer: server });
    }),
    setTestGrpcServer: (server: Server) => update((config) => {
      return ({ ...config, testGrpcServer: server });
    }),
  };
}


export const appConfigStore = createAppConfigStore();
