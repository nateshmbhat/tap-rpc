// @ts-ignore
import * as Store from "electron-store";
import type { ProtoFile } from "../renderer/behaviour";

const protosStore = new Store<ProtoFile[]>({
  defaults : [],
  name: "protoFiles",
});

const KEYS = {
  PROTOS: "protoFiles"
};

export function storeProtoFiles(paths: ProtoFile[]) {
  protosStore.set(KEYS.PROTOS, paths);
}

export function fetchProtoFiles(): ProtoFile[] {
  return protosStore.get(KEYS.PROTOS, []);
}

export function clearProtoFiles() {
  return protosStore.clear();
}