<script lang="ts">
  import { Button } from 'svelte-materialify/src'
  import { FileSystemUtil } from '../../../commons/utils/util'
  import { protoImportPathsStore } from '../../../stores'
  import { loadProtoResolvePathFromFilePicker } from '../../behaviour'

  const addProtoPath = async () => {
    const newProtoPaths = await loadProtoResolvePathFromFilePicker()
    if (newProtoPaths.length > 0) {
      protoImportPathsStore.addPaths(newProtoPaths)
    }
  }
</script>

<h6>Proto Paths</h6>
<Button on:click={addProtoPath}>Add Proto Path</Button>
{#each $protoImportPathsStore as protoPath}
  <div class="row">{protoPath}</div>
{/each}
