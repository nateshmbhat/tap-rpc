import { ProtoPathDiskStore } from "./importPaths";
import { ProtoFilesDiskStore } from "./protos";
import { TlsCertDiskStore } from "./tls";

export class ElectronDiskStorage {
  clearAllDiskStores() {
    ProtoPathDiskStore.clear();
    ProtoFilesDiskStore.clear();
    TlsCertDiskStore.clear();
  }
}