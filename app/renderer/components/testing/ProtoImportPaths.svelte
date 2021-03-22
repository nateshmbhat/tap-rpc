<script lang="ts">
  import { protoImportPathsStore } from '../../../stores'
  import { Button } from 'svelte-materialify/src'
  import { importProtoResolvePath } from '../../behaviour'
  $: protoPaths = $protoImportPathsStore

  const onAddProtoPathClicked = async () => {
    const resolvePaths = await importProtoResolvePath()
    protoImportPathsStore.addPaths(resolvePaths)
  }
</script>

<ul>
  {#each protoPaths as protoPath}
    <li>{protoPath}</li>
  {/each}
</ul>

<Button on:click={onAddProtoPathClicked}>Add Proto Path</Button>
