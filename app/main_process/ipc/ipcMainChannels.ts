import type { IpcMainEvent } from "electron";
import { loadProtos, ProtoFile, ProtoService } from "../../renderer/behaviour";
import { IpcChannel, IpcMainChannelInterface, IpcRequest } from "../../commons/ipc/ipcChannelInterface";
import { protoFilesStore, protoImportPathsStore } from "../../stores";
import { startProxyGrpcServer } from "../grpcServer";
import { get } from "svelte/store";

export class StartServerChannel implements IpcMainChannelInterface {
    getName(): string {
        return IpcChannel.startServer;
    }

    async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        const { protoFilePaths } = request.params
        const protoFiles = await loadProtos(protoFilePaths, get(protoImportPathsStore))

        var protoServices: ProtoService[] = []
        protoFiles.forEach((protoFile: ProtoFile) => protoServices.push(...Object.values(protoFile.services)))
        startProxyGrpcServer(protoServices)

        event.sender.send(request.responseChannel, {});
    }
}

export class SetProtoImportPathsChannel implements IpcMainChannelInterface {
    getName(): string {
        return IpcChannel.setProtoImportPaths;
    }

    async handle(event: IpcMainEvent, request: IpcRequest): Promise<void> {
        if (!request.responseChannel) {
            request.responseChannel = `${this.getName()}_response`;
        }
        const { folderPaths } = request.params
        protoImportPathsStore.setProtoImportPaths(folderPaths)
        event.sender.send(request.responseChannel, {});
    }
}