<script>
	import { MonitorConnectionStatus } from "../../../../components/types/types";
	import { Button, Icon ,Tooltip } from "svelte-materialify/src";
	import {mdiPlaylistEdit, mdiTimelapse, mdiTimer} from '@mdi/js'
  
	export let connectionStatus : MonitorConnectionStatus
</script>

<Button icon class="primary-text">
  {#if connectionStatus == MonitorConnectionStatus.onHold}
    <Tooltip bottom>
      <Icon path={mdiPlaylistEdit} />
      <span slot="tip">Editing in progress. Connection on hold</span>
    </Tooltip>
  {:else}
    <Tooltip bottom>
      <Icon path={mdiTimer} />
      <span slot="tip">Waiting for Incoming data</span>
    </Tooltip>
  {/if}
</Button>
