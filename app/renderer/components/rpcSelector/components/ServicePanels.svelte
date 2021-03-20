<script lang="ts">
  import { Icon, List, ListGroup, ListItem } from 'svelte-materialify/src'
  import { activeTabConfigStore } from '../../../../stores'

  import type { ProtoService } from '../../../behaviour'

  export let protoServices: ProtoService[] = []
  let active = false

  function getServiceMethods(service: ProtoService): string[] {
    return Object.keys(service.methods)
  }

  function onRpcClick(protoService: ProtoService, rpcMethod: string) {
    activeTabConfigStore.setSelectedRpc(protoService.methods[rpcMethod])
  }
</script>

<List class="elevation-1">
  {#each protoServices as protoService (protoService['serviceName'])}
    <ListGroup bind:active>
      <span slot="prepend">
        <Icon class="mdi mdi-cog" />
      </span>
      <span slot="activator">{protoService['serviceName']}</span>
      <span slot="append">
        <Icon class="mdi mdi-chevron-up ml-3" rotate={active ? 0 : 180} />
      </span>
      {#each getServiceMethods(protoService) as rpcMethod (rpcMethod)}
        <ListItem on:click={(e) => onRpcClick(protoService, rpcMethod)}>
          {rpcMethod}
        </ListItem>
      {/each}
    </ListGroup>
  {/each}
</List>
