<script>
  import GenericEditor from "../../../../components/editors/GenericEditor.svelte";
  import { activeTabConfigStore } from "../../../../../stores";
  import { ExpansionPanel, ExpansionPanels } from "svelte-materialify/src";

  $: requestState = $activeTabConfigStore.monitorRequestEditorState;
  $: incomingRequest = requestState.incomingRequest

  function onMetadataChanged(text:string){
    if(incomingRequest===undefined) return
    activeTabConfigStore.setMonitorRequestEditorState({
      ...requestState , incomingRequest : {
        ...incomingRequest,metadata : text
      }
    })
  }

</script>

{#if incomingRequest !== undefined}
  <div>
    <ExpansionPanels class="pa-0" style="z-index: 100;">
      <ExpansionPanel class="pa-0">
        <span slot="header">Metadata</span>
        <GenericEditor
          text={incomingRequest.metadata}
          height="250px"
          on:textChange={e => onMetadataChanged(e.detail)}
        />
      </ExpansionPanel>
    </ExpansionPanels>
  </div>
{/if}
