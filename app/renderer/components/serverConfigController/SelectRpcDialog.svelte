<script lang="ts">
  import { Dialog } from "svelte-materialify";
  import RpcSelector from "../rpcSelector/RpcSelector.svelte";
  export let active = false;
</script>

<Dialog class="pa-4" bind:active>
  <RpcSelector />
</Dialog>
