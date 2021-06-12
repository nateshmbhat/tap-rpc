<script lang="ts">
  import { loadProtos, ProtoService } from "../../behaviour";
  import path from "path";
  import { Button } from "svelte-materialify/src";
  import { protoFilesStore, protoImportPathsStore } from "../../../stores";
  import { FileSystemUtil, ProtoUtil } from "../../../commons/utils/util";
  import { startTestGrpcServer } from "../testing/GrpcTestServer";
  import { get } from "svelte/store";
  import { snackBarStore } from "../../../stores/snackBarStore";

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
  };

  async function importProtoFiles() {
    const protoImportPaths = get(protoImportPathsStore);
    const selectedFilesResult = await FileSystemUtil.getProtoFilesFromFilePicker();
    if (selectedFilesResult.canceled) return;
    ProtoUtil.loadProtoFilesAndStartServer(
      selectedFilesResult.filePaths,
      protoImportPaths
    ).catch(e => {
      snackBarStore.showSnackbar({
        message: [
          `${e}`,
          'If your proto files import other proto files, make sure you have added the directory to "Proto Paths" to look for those imported proto files.'
        ],
        durationInSeconds: 10
      });
    });
  }

  function clearProtoFiles() {
    protoFilesStore.clearAllProtoFiles();
  }

</script>

<!-- <Button on:click={importSampleProto}>Import sample Proto</Button> -->
<Button on:click={importProtoFiles}>Import Proto Files</Button>
<Button on:click={clearProtoFiles}>Clear All</Button>
