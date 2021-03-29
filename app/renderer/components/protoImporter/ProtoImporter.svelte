<script lang="ts">
  import { loadProtos, ProtoService } from "../../behaviour";
  import path from "path";
  import { Button } from "svelte-materialify/src";
  import { MainProcessInterface } from "../../ipc/ipcMainProcessInterface";
  import {
    appConfigStore,
    protoFilesStore,
    protoImportPathsStore
  } from "../../../stores";
  import { FileSystemUtil } from "../../../commons/utils/util";
  import { startTestGrpcServer } from "../testing/GrpcTestServer";
  import { get } from "svelte/store";

  const SAMPLE_PROT_PATH = path.join(
    //@ts-ignore
    __STATIC_PATH__,
    "sample",
    "greeter-service.proto"
  );
  const importSampleProto = async () => {
    const protoFiles = await loadProtos([SAMPLE_PROT_PATH]);

    console.dir(protoFiles);
    protoFilesStore.setProtoFiles(protoFiles);
    var protoServices: ProtoService[] = [];

    protoFiles.forEach(protoFile =>
      protoServices.push(...Object.values(protoFile.services))
    );
    startTestGrpcServer(protoServices);
    MainProcessInterface.importProtoFromMainProcess([SAMPLE_PROT_PATH]).then(
      _ => {
        MainProcessInterface.startProxyGrpcServer(
          $appConfigStore.proxyGrpcServerUrl
        );
      }
    );
  };

  async function importProtoFiles() {
    const appConfig = get(appConfigStore);
    const protoImportPaths = get(protoImportPathsStore);
    const selectedFilesResult = await FileSystemUtil.getProtoFilesFromFilePicker();
    if (selectedFilesResult.canceled) return;

    const loadedProtoFiles = await loadProtos(
      selectedFilesResult.filePaths,
      protoImportPaths
    );

    protoFilesStore.addProtoFiles(loadedProtoFiles);
    MainProcessInterface.importProtoFromMainProcess(
      selectedFilesResult.filePaths,
      protoImportPaths
    ).then(_ => {
      MainProcessInterface.startProxyGrpcServer(appConfig.proxyGrpcServerUrl);
    });
  }

  function clearProtoFiles() {
    protoFilesStore.clearAllProtoFiles();
  }
</script>

<!-- <Button on:click={importSampleProto}>Import sample Proto</Button> -->
<Button on:click={importProtoFiles}>Import Proto Files</Button>
<Button on:click={clearProtoFiles}>Clear All</Button>
