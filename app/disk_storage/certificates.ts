// @ts-ignore
import * as Store from "electron-store";
import { CertificateUtil } from "../commons/utils/certificateUtil";
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
    return diskStore.get(TLS_KEYS.CERTIFICATES, [CertificateUtil.getDefaultServerCertificate()]);
  }

  static clear() {
    return diskStore.clear();
  }
}