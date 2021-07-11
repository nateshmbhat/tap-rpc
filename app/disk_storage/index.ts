import { ProtoPathDiskStore } from "./importPaths";
import { ProtoFilesDiskStore } from "./protos";
import { TlsCertDiskStore } from "./certificates";
import { AppDataDiskStore } from "./appDataDiskStorage";

export class ElectronDiskStorage {
  clearAllDiskStores() {
    ProtoPathDiskStore.clear()
    ProtoFilesDiskStore.clear()
    TlsCertDiskStore.clear()
    TlsCertDiskStore.clear()
    AppDataDiskStore.clear()
  }
}