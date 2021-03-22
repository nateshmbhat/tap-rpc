<script lang="ts">
  import { Button, List, ListItem, Menu } from 'svelte-materialify/src'
  import { RpcOperationMode, activeTabConfigStore } from '../../../stores'
  const modes = Object.values(RpcOperationMode)
  $: currentMode = $activeTabConfigStore.rpcOperationMode

  const changeMode = (mode: RpcOperationMode) => {
    activeTabConfigStore.setRpcOperationMode(mode)
  }
</script>

<Menu>
  <div slot="activator">
    <Button active>{currentMode}</Button>
  </div>
  <List>
    {#each modes as mode (mode)}
      <ListItem on:click={(e) => changeMode(mode)}>{mode}</ListItem>
    {/each}
  </List>
</Menu>
