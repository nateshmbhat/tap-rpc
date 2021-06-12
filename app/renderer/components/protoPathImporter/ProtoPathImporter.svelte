<script lang="ts">
  import { Button, Card, Icon, List, ListItem } from "svelte-materialify/src";
  import { protoImportPathsStore } from "../../../stores";
  import { loadProtoResolvePathFromFilePicker } from "../../behaviour";
  import { mdiFolder, mdiDelete } from "@mdi/js";

  const addProtoPath = async () => {
    const newProtoPaths = await loadProtoResolvePathFromFilePicker();
    if (newProtoPaths.length > 0) {
      protoImportPathsStore.addPaths(newProtoPaths);
    }
  };

  const deleteProtoPath = async (protoPath: string) => {
    protoImportPathsStore.removePath(protoPath);
  };

</script>

<Card outlined class="pa-4">
  <h6>Proto Paths</h6>
  <Button on:click={addProtoPath}>Add Proto Path</Button>

  <List class="elevation-1">
    {#each $protoImportPathsStore as protoPath}
      <ListItem>
        <span slot="prepend">
          <Icon path={mdiFolder} />
        </span>
        <div class="row" style="align-items:center;">
          <div class="col" style="flex-grow:1">
            {protoPath}
          </div>
          <div class="col">
            <Button
              size={"small"}
              icon
              rounded
              class="red-text"
              on:click={e => deleteProtoPath(protoPath)}
            >
              <Icon path={mdiDelete} />
            </Button>
          </div>
        </div>
      </ListItem>
    {/each}
  </List>
</Card>
