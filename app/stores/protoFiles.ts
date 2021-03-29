import { writable } from "svelte/store";
import type { ProtoFile } from "../renderer/behaviour/models";
import { ProtoPathDiskStore } from "../disk_storage/importPaths";
import { ElectronUtil } from "../commons/utils/electron_util";
import { MainProcessInterface } from "../renderer/ipc/ipcMainProcessInterface";
import { ProtoFilesDiskStore } from "../disk_storage/protos";

function createProtoFilesStore() {
  const { subscribe, set, update } = writable<ProtoFile[]>([]);
  return {
    subscribe,
    addProtoFiles: (newProtoFiles: ProtoFile[]) => {
      update((data) => {
        const newState = [...newProtoFiles, ...data]
        if (ElectronUtil.isInRendererProcess()) {
          MainProcessInterface.startServer(newState.map(d => d.proto.filePath))
          ProtoFilesDiskStore.setProtoFiles(newState.map(d => d.proto.filePath))
        }
        return newState;
      })
    },
    setProtoFiles: (protoFiles: ProtoFile[]) => {
      if (ElectronUtil.isInRendererProcess()) {
        MainProcessInterface.startServer(protoFiles.map(d => d.proto.filePath))
        ProtoFilesDiskStore.setProtoFiles(protoFiles.map(d => d.proto.filePath))
      }
      set(protoFiles)
    },
    clearAllProtoFiles: () => {
      update((_) => [])
      ProtoFilesDiskStore.clear()
    }
  };
}

function createProtoImportPathsStore() {
  const { subscribe, set, update } = writable<string[]>(ProtoPathDiskStore.fetchPaths());
  return {
    subscribe,
    setProtoImportPaths: (protoPaths: string[]) => {
      set(protoPaths)
      if (ElectronUtil.isInRendererProcess()) {
        ProtoPathDiskStore.setProtoPaths(protoPaths)
        MainProcessInterface.setProtoImportPaths(protoPaths)
      }
    },
    addPaths: (newProtoPaths: string[]) => {
      update((paths) => {
        const newState = [...newProtoPaths, ...paths];
        if (ElectronUtil.isInRendererProcess()) {
          ProtoPathDiskStore.setProtoPaths(newState)
          MainProcessInterface.setProtoImportPaths(newState)
        }
        return newState
      });
    },
  };
}

export const protoFilesStore = createProtoFilesStore();
export const protoImportPathsStore = createProtoImportPathsStore()
