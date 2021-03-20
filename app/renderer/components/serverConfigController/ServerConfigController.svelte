<script lang="ts">
  import { activeTabConfigStore, appConfigStore } from '../../../stores'
  import { Button } from 'svelte-materialify/src'
  $: targetServer = $activeTabConfigStore.targetGrpcServerUrl
</script>

<label for="target-server">Target Server :</label>
<input
  on:input={(e) => activeTabConfigStore.setTargetGrpcServerUrl(e.currentTarget.value)}
  value={targetServer}
  name="target-server"
  placeholder="Target server" />
