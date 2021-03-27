<script lang="ts">
  import { pathToFileURL } from 'url'
  import { loadProtos, ProtoService } from '../../behaviour'
  import path from 'path'
  import { createEventDispatcher } from 'svelte'
  import type { ProtoFile } from '../../behaviour'
  import { Button } from 'svelte-materialify/src'
  import { loadPackageDefinition, credentials } from '@grpc/grpc-js'
  import type { PackageDefinition } from '@grpc/grpc-js/build/src/make-client'
  import { MainProcessInterface } from '../../ipc/ipcMainProcessInterface'
  import { appConfigStore, protoImportPathsStore } from '../../../stores'
  import { FileSystemUtil } from '../../../commons/utils/util'
  import { startTestGrpcServer } from '../testing/GrpcTestServer'
  import { get } from 'svelte/store'
  var protoLoader = require('@grpc/proto-loader')

  var dispatcher = createEventDispatcher<{ onProtoLoaded: ProtoFile[] }>()
  const SAMPLE_PROT_PATH = path.join(
    //@ts-ignore
    __STATIC_PATH__,
    'sample',
    'greeter-service.proto',
  )
  const importSampleProto = async () => {
    const protoFiles = await loadProtos([SAMPLE_PROT_PATH])

    console.dir(protoFiles)
    dispatcher('onProtoLoaded', protoFiles)
    var protoServices: ProtoService[] = []

    protoFiles.forEach((protoFile) =>
      protoServices.push(...Object.values(protoFile.services)),
    )
    startTestGrpcServer(protoServices)
    MainProcessInterface.importProtoFromMainProcess([SAMPLE_PROT_PATH]).then(
      (_) => {
        MainProcessInterface.startProxyGrpcServer(
          $appConfigStore.proxyGrpcServerUrl,
        )
      },
    )
  }

  // function testLoadService() {
  //   const packageDefinition: PackageDefinition = protoLoader.loadSync(
  //     SAMPLE_PROT_PATH,
  //     {
  //       keepCase: true,
  //       longs: String,
  //       enums: String,
  //       defaults: true,
  //       oneofs: true,
  //     },
  //   )
  //   console.log('package definition : ', packageDefinition)
  //   var hello_proto = loadPackageDefinition(packageDefinition)

  //   console.log('loaded package definition : ', hello_proto)
  //   hello_proto['service']
  // }

  async function importProtoFiles() {
    const appConfig = await appConfigStore.getValue()
    const protoImportPaths = get(protoImportPathsStore)
    const selectedFilesResult = await FileSystemUtil.getProtoFilesFromFilePicker()
    if (selectedFilesResult.canceled) return

    const loadedProtoFiles = await loadProtos(
      selectedFilesResult.filePaths,
      protoImportPaths,
    )

    dispatcher('onProtoLoaded', loadedProtoFiles)
    MainProcessInterface.importProtoFromMainProcess(
      selectedFilesResult.filePaths,
      protoImportPaths,
    ).then((_) => {
      MainProcessInterface.startProxyGrpcServer(appConfig.proxyGrpcServerUrl)
    })
  }
</script>

<Button on:click={importSampleProto}>Import sample Proto</Button>
<Button on:click={importProtoFiles}>Import real Proto Files</Button>
