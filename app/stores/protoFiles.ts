import { get, writable } from "svelte/store";
import type { ProtoFile } from "../renderer/behaviour/models";
import { ProtoFilesDiskStore } from "../disk_storage/protos";
import { ProtoPathDiskStore } from "../disk_storage/importPaths";
import { MainProcessInterface } from "../renderer/ipc/ipcMainProcessInterface";
import { appConfigStore } from "./appConfigStore";

function createProtoFilesStore() {
  const { subscribe, set, update } = writable<ProtoFile[]>([]);
  return {
    subscribe,
    setProtoFiles: (protoFiles: ProtoFile[]) => {
      set(protoFiles)
      ProtoFilesDiskStore.setProtoFiles(protoFiles.map(pf => pf.fileName))
    },
    addProtoFiles: (newProtoFiles: ProtoFile[]) => {
      update((data) => [...data, ...newProtoFiles])
      ProtoFilesDiskStore.addProtoFiles(newProtoFiles.map((pf) => pf.fileName))
    }
  };
}

function createProtoImportPathsStore() {
  const { subscribe, set, update } = writable<string[]>(ProtoPathDiskStore.fetchPaths());
  return {
    subscribe,
    setProtoImportPaths: (protoPaths: string[]) => {
      set(protoPaths)
      ProtoPathDiskStore.setProtoPaths(protoPaths)
    },
    addPath: (newProtoPath: string) => {
      update((paths) => [newProtoPath, ...paths])
      ProtoPathDiskStore.addProtoPaths([newProtoPath])
    },
    addPaths: (newProtoPaths: string[]) => {
      update((paths) => [...paths, ...newProtoPaths]);
      ProtoPathDiskStore.addProtoPaths(newProtoPaths)
    },
  };
}

export const protoFilesStore = createProtoFilesStore();
export const protoImportPathsStore = createProtoImportPathsStore()
