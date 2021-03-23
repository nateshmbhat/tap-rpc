import { writable } from "svelte/store";
import type { ProtoFile, RpcProtoInfo } from "../renderer/behaviour/models";
import { fetchProtoFiles } from "../renderer/disk_storage";
import path from 'path'

function createProtoFilesStore() {
  const { subscribe, set, update } = writable<ProtoFile[]>(fetchProtoFiles());
  return {
    subscribe,
    setProtoFiles: (protoFiles: ProtoFile[]) => {
      set(protoFiles)
    },
    getValue: async () => new Promise<ProtoFile[]>((res, rej) => subscribe(config => res(config))()),
  };
}

function createProtoImportPathsStore() {
  const { subscribe, set, update } = writable<string[]>([]);
  return {
    subscribe,
    setProtoImportPaths: (protoPaths: string[]) => {
      set(protoPaths)
    },
    addPath: (newProtoPath: string) => update((paths) => [...paths, newProtoPath]),
    addPaths: (newProtoPaths: string[]) => update((paths) => [...paths, ...newProtoPaths]),
  };
}

export const protoFilesStore = createProtoFilesStore();
export const protoImportPathsStore = createProtoImportPathsStore()
