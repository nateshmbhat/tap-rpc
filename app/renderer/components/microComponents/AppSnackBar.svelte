<script>
import { Button, Icon, Snackbar } from "svelte-materialify/src";
import { snackBarStore } from "../../../stores/snackBarStore";
import {mdiCloseCircleOutline} from '@mdi/js'


function closeSnackBar(){
  snackBarStore.closeSnackbar();
}

</script>

<Snackbar
  bottom
  left
  active={$snackBarStore.isActive}
  timeout={$snackBarStore.sticky ? undefined : $snackBarStore.duration}
  style="background:gray;"
>
  <div class="row" style="width:100%">
    <div style="flex-grow: 2;align-self:center;">
      {#if typeof $snackBarStore.message === "string"}
        {$snackBarStore.message}
      {:else}
        {#each $snackBarStore.message as line (line)}
          <div>
            {line}
          </div>
        {/each}
      {/if}
    </div>
    <div>
      <Button size="small" icon class="gray-text" on:click={closeSnackBar}>
        <Icon path={mdiCloseCircleOutline} />
      </Button>
    </div>
  </div>
</Snackbar>
