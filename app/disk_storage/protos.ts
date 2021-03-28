// @ts-ignore
import * as Store from "electron-store";
import type { ProtoFile } from "../renderer/behaviour";

const protosStore = new Store<string[]>({
  defaults: [],
  name: "protoFiles",
});

const KEYS = {
  PROTOS: "protoFiles"
};

export abstract class ProtoFilesDiskStore {
  static setProtoFiles(protoFilePaths: string[]) {
    protosStore.set(KEYS.PROTOS, protoFilePaths);
  }

  static addProtoFiles(newProtoFilePaths: string[]) {
    protosStore.set(KEYS.PROTOS, [newProtoFilePaths, ...this.fetchProtoFiles(),]);
  }

  static fetchProtoFiles(): string[] {
    return protosStore.get(KEYS.PROTOS, []);
  }

  static clear() {
    return protosStore.clear();
  }
}
