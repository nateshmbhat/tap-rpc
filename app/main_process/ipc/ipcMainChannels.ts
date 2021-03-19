import { execSync } from "child_process";
import { profile } from "console";
import type { IpcMainEvent } from "electron";
import { loadProtos, ProtoService } from "../../renderer/behaviour";
import { IpcChannel, IpcMainChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { protoFilesStore } from "../../stores";
import { startProxyGrpcServer } from "../grpcServer";

export class ProtoImporterChannel implements IpcMainChannelInterface {
    getName(): string {
        return IpcChannel.importProto;
    }

    async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        const { protoFilePaths, resolvePaths } = request.params
        const protoFiles = await loadProtos(protoFilePaths, resolvePaths)
        protoFilesStore.setProtoFiles(protoFiles)
        event.sender.send(request.responseChannel, {});
    }
}

export class GrpcServerChannel implements IpcMainChannelInterface {
    getName(): string {
        return IpcChannel.startProxyGrpcServer;
    }
    async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        const { serverUrl } = request.params
        var protoFiles = await protoFilesStore.getValue()
        var protoServices: ProtoService[] = []
        
        protoFiles.forEach(protoFile => protoServices.push(...Object.values(protoFile.services)))
        startProxyGrpcServer(protoServices)
        event.sender.send(request.responseChannel, {});
    }
}
