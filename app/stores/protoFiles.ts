import { writable } from "svelte/store";
import type { ProtoFile, RpcProtoInfo } from "../renderer/behaviour/models";
import path from 'path'

function createProtoFilesStore() {
  const { subscribe, set, update } = writable<ProtoFile[]>([]);
  return {
    subscribe,
    setProtoFiles: (protoFiles: ProtoFile[]) => {
      set(protoFiles)
    },
    getValue: async () => new Promise<ProtoFile[]>((res, rej) => subscribe(config => res(config))()),
  };
}

function createProtoImportPathsStore() {
  const { subscribe, set, update } = writable<string[]>([path.join(
    //@ts-ignore
    __static,
    'sample',
  )]);
  return {
    subscribe,
    setProtoImportPaths: (protoPaths: string[]) => {
      set(protoPaths)
    },
    addPath: (newProtoPath: string) => update((paths) => [...paths, newProtoPath]),
    addPaths: (newProtoPaths: string[]) => update((paths) => [...paths, ...newProtoPaths]),
    getValue: async () => new Promise<string[]>((res, rej) => subscribe(config => res(config))()),
  };
}

export const protoFilesStore = createProtoFilesStore();
export const protoImportPathsStore = createProtoImportPathsStore()
