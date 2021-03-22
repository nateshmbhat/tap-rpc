<script lang="ts">
  import { onMount } from 'svelte'
  import { activeTabConfigStore } from '../../../../stores'

  import MockRpcEditor from '../../../components/editors/MockRpcEditor.svelte'

  onMount(() => {
    if ($activeTabConfigStore.selectedRpc != null) {
      activeTabConfigStore.setMockRpcEditorText(
        $activeTabConfigStore.selectedRpc.mockResponsePayloadString,
      )
    }
  })
</script>

<div>
  <MockRpcEditor />
</div>