import { ProtoPathDiskStore } from "./importPaths";
import { ProtoFilesDiskStore } from "./protos";
import { TlsCertDiskStore } from "./certificates";

export class ElectronDiskStorage {
  clearAllDiskStores() {
    ProtoPathDiskStore.clear();
    ProtoFilesDiskStore.clear();
    TlsCertDiskStore.clear();
  }
}