// @ts-ignore
import * as Store from "electron-store";

const ImportPathsDiskStore = new Store({
  name: "importPaths",
});

const KEYS = {
  IMPORT_PATH: "paths"
};
export abstract class ProtoPathDiskStore {
  static setProtoPaths(paths: string[]) {
    ImportPathsDiskStore.set(KEYS.IMPORT_PATH, paths);
  }

  static fetchPaths(): string[] {
    return ImportPathsDiskStore.get(KEYS.IMPORT_PATH, []);
  }

  static clear() {
    return ImportPathsDiskStore.clear();
  }
}