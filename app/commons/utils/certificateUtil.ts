import type { Certificate } from "../../renderer/behaviour";

export class CertificateUtil {
    static getDefaultServerCertificate(): Certificate {
        const serverCertificate = {
            useServerCertificate: true,
            rootCert: { fileName: "Server Certificate", filePath: "" },
        };
        return serverCertificate
    }
}