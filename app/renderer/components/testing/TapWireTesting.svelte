<script lang="ts">
  import { onMount } from 'svelte'

  import type { ProtoFile } from '../../behaviour'

  import {
    appConfigStore,
    protoFilesStore,
    activeTabConfigStore,
    servicesStore,
  } from '../../../stores/index'

  import ImportProtoButton from './buttons/ImportProtoButton.svelte'
  import RequestEditor from './editor/RequestEditor.svelte'
  import ResponseEditor from './editor/ResponseEditor.svelte'
  import TargetServerField from './testing/TargetServerField.svelte'
  import SetRpcOperationMode from './testing/SetRpcOperationMode.svelte'
  import ClientSimulator from './testing/ClientSimulator.svelte'
  import RpcSelector from './rpcSelector/RpcSelector.svelte'
  import { fade } from 'svelte/transition'
  import { ipcRenderer, remote } from 'electron'
  import  {Button} from 'svelte-materialify/src'
  import { startDummyGrpcTargetServer } from '../../../../internals'
  import ProtoImportPaths from './testing/ProtoImportPaths.svelte'
  import MetadataEditor from './editor/MetadataEditor.svelte'

  const onProtoLoaded = (protoFiles: ProtoFile[]) => {
    console.log(protoFiles)
    protoFilesStore.setProtoFiles(protoFiles)
  }
  onMount(() => {
    startDummyGrpcTargetServer({ port: 9090 })
  })
  let visible: boolean = false
</script>

<style>
  div.request-response-holder {
    display: flex;
  }
</style>

{#if visible}
  <div class="request-response-holder" transition:fade>
    <RequestEditor width="50%" />
    <ResponseEditor width="50%" />
  </div>
  <MetadataEditor width="50%" height="300" />
  <TargetServerField />
  <ClientSimulator />
  <SetRpcOperationMode />
{:else}
  <div transition:fade>
    <RpcSelector />
  </div>
{/if}

<Button on:click={() => (visible = !visible)}>hide/show</Button>

<Button on:click={() => ipcRenderer.send('testing-ipc', $servicesStore)}>
  IPC SEND
</Button>

<ImportProtoButton on:onProtoLoaded={(e) => onProtoLoaded(e.detail)} />

<ProtoImportPaths />
