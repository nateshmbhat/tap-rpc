// @ts-ignore
import * as Store from "electron-store";
import type { Certificate } from "../renderer/behaviour";

const diskStore = new Store({
  name: "tlsCert",
});

const TLS_KEYS = {
  CERTIFICATES: 'certificates'
};

export abstract class TlsCertDiskStore {
  static storeTLSList(certs: Certificate[]) {
    diskStore.set(TLS_KEYS.CERTIFICATES, certs);
  }

  static getTLSList() {
    const serverCertificate = {
      useServerCertificate: true,
      rootCert: { fileName: "Server Certificate", filePath: "" },
    };
    return diskStore.get(TLS_KEYS.CERTIFICATES, [serverCertificate]);
  }

  static clear() {
    return diskStore.clear();
  }
}