<script lang="ts">
  import type { ProtoFile, ProtoService } from '../../behaviour'
  import ImportProtoButton from '../buttons/ImportProtoButton.svelte'
  import { Button } from 'svelte-materialify/src'
  import { servicesStore } from '../../../stores'
  import { startProxyGrpcServer } from '../../../main_process'

  function onServiceSelected(service: ProtoService) {
    startProxyGrpcServer([service])
  }
</script>

<h5>Service List</h5>

{#each $servicesStore as service}
  <Button on:click={(e) => onServiceSelected(service)}>
    {service.serviceName}
  </Button>
{/each}
