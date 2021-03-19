import { derived, writable } from "svelte/store";
import type { ProtoFile, ProtoService, RpcProtoInfo } from "../renderer/behaviour";
import { protoFilesStore } from "./protoFiles";

export const rpcProtoInfosStore = derived(protoFilesStore, ($protoFilesStore) => {
    const protoFiles = $protoFilesStore
    const protoInfos: RpcProtoInfo[] = []

    protoFiles.forEach(protoFile => {
        Object.entries(protoFile.services).forEach(([serviceName, service]) => {
            Object.values(service.methods).forEach(methodRpcInfo => protoInfos.push(methodRpcInfo))
        })
    })
    return protoInfos
})

function createServicesStore() {
    const { subscribe } = derived(protoFilesStore, ($protoFilesStore) => {
        const protoFiles = $protoFilesStore
        const services: ProtoService[] = []

        protoFiles.forEach(protoFile => {
            Object.entries(protoFile.services).forEach(([serviceName, service]) => {
                services.push(service)
            })
        })
        return services
    })
    return {
        subscribe,
        getValue: async () => new Promise<ProtoService[]>((res, rej) => subscribe(config => res(config))()),
    }
}

export const servicesStore = createServicesStore()