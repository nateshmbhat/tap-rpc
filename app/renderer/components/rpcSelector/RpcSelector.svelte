<script lang="ts">
  import type { ProtoFile, ProtoService, RpcProtoInfo } from '../../behaviour'
  import { activeTabConfigStore, protoFilesStore } from '../../../stores'
  import Folder from './components/Folder.svelte'
  import type { RpcSelectorFileType } from '../types/types'
  import { Card } from 'svelte-materialify/src';

  $: protoFiles = $protoFilesStore

  function getProtoFileServices(protoFile: ProtoFile): ProtoService[] {
    return Object.values(protoFile.services)
  }

  function getServiceMethods(service: ProtoService): RpcSelectorFileType[] {
    const methodNames = Object.keys(service.methods)
    return methodNames.map((methodName) => ({
      name: methodName,
      type: 'file',
      protoInfo: service.methods[methodName],
      files: [],
    }))
  }
  const mapServicesToRpcSelectorModel = (
    services: ProtoService[],
  ): RpcSelectorFileType[] => {
    let results: RpcSelectorFileType[] = []
    services.forEach((service) => {
      results.push({
        name: service.serviceName,
        type: 'folder',
        files: getServiceMethods(service),
      })
    })
    return results
  }

  const protoFilesToRpcSelectorModel = (
    protoFiles: ProtoFile[],
  ): RpcSelectorFileType[] => {
    let results: RpcSelectorFileType[] = []
    protoFiles.forEach((protoFile) => {
    const services = getProtoFileServices(protoFile)
    if(services.length==0) return;
      results.push({
        name: protoFile.fileName,
        type: 'folder',
        files: mapServicesToRpcSelectorModel(services),
      })
    })
    return results
  }

  const onRpcClick = (protoInfo: RpcProtoInfo) => {
    activeTabConfigStore.setSelectedRpc(protoInfo)
  }
</script>

<Card outlined class="pa-2">
  {#if protoFiles.length > 0}
    <Folder
      on:fileClick={e => onRpcClick(e.detail)}
      name="Proto Files"
      expanded
      files={protoFilesToRpcSelectorModel(protoFiles)}
    />
  {:else}
    <div />
  {/if}
</Card>
