<script lang="ts">
  import { activeTabConfigStore, appConfigStore } from '../../../stores'
  $: targetServer = $activeTabConfigStore.targetGrpcServerUrl
</script>

<input
  on:input={(e) => activeTabConfigStore.setTargetGrpcServerUrl(e.currentTarget.value)}
  value={targetServer}
  placeholder="Target server" />
