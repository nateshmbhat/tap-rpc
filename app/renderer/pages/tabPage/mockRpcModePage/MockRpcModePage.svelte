<script lang="ts">
  import { Switch } from "svelte-materialify/src";
  import MockRpcErrorEditor from "./components/MockRpcErrorEditor.svelte";

  let sendErrorResponse = false;
  import MockRpcResponseEditor from "./components/MockRpcResponseEditor.svelte";
</script>

<div class="page">
  <Switch class="ml-5 mr-5 align-self-center" bind:checked={sendErrorResponse}>
    <div style="cursor: pointer;">Send Error</div>
  </Switch>

  {#if sendErrorResponse}
    <MockRpcErrorEditor />
  {:else}
    <MockRpcResponseEditor />
  {/if}
</div>

<style>
  .page {
    height: calc(100vh - 52px);
    display: flex;
    flex-flow: column;
  }
</style>
