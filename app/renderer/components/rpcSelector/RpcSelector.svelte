<script lang="ts">
  import type { ProtoFile, ProtoService, RpcProtoInfo} from '../../behaviour'
  import { activeTabConfigStore, protoFilesStore } from '../../../stores'
  import ImportProtoButton from '../protoImporter/ImportProtoButton.svelte'
  import Folder from './components/Folder.svelte'
  import type { RpcSelectorFileType } from '../types/types';

  $: protoFiles = $protoFilesStore

  function getProtoFileServices(protoFile: ProtoFile): ProtoService[] {
    return Object.values(protoFile.services)
  }

  function getServiceMethods(service: ProtoService): RpcSelectorFileType[] {
    const methodNames = Object.keys(service.methods)
    return methodNames.map(methodName=>({name : methodName , type:'file' , protoInfo:service.methods[methodName] , files:[]}))
  }

  const onProtoLoaded = (protoFiles: ProtoFile[]) => {
    console.log(protoFiles)
    protoFilesStore.setProtoFiles(protoFiles)
  }

  const mapServicesToRpcSelectorModel = (services:ProtoService[]) : RpcSelectorFileType[]=>{
    let results : RpcSelectorFileType[]  = []
    services.forEach(service=>{
      results.push({name : service.serviceName , type: 'folder' , files:getServiceMethods(service)})
    })
    return results
  }

  const protoFilesToRpcSelectorModel = (protoFiles:ProtoFile[]): RpcSelectorFileType[]=>{
    let results : RpcSelectorFileType[]  = []
    protoFiles.forEach(protoFile =>{
      results.push({name : protoFile.fileName, type: 'folder' , files:mapServicesToRpcSelectorModel(getProtoFileServices(protoFile))})
    })
    return results
  }

  const onRpcClick = (protoInfo: RpcProtoInfo)=>{
    activeTabConfigStore.setSelectedRpc(protoInfo)
  }
</script>

{#if protoFiles.length == 0}
  <ImportProtoButton on:onProtoLoaded={e => onProtoLoaded(e.detail)} />
{:else}
  <Folder
    on:fileClick={e => onRpcClick(e.detail)}
    name="Tap rpc"
    expanded
    files={protoFilesToRpcSelectorModel(protoFiles)}
  />
{/if}
