<script>
	import { ExpansionPanel, ExpansionPanels } from "svelte-materialify/src";
	import { activeTabConfigStore } from "../../../../../stores";
	import GenericEditor from "../../../../components/editors/GenericEditor.svelte";
  
	$: requestState = $activeTabConfigStore.clientRequestEditorState;
  
	function onMetadataChanged(text:string){
	  activeTabConfigStore.setClientRequestEditorState({
		...requestState , metadata : text })
	}

</script>

<div>
  <ExpansionPanels class="pa-0" style="z-index: 100;">
    <ExpansionPanel class="pa-0">
      <span slot="header">Metadata</span>
      <GenericEditor
        text={requestState.metadata}
        height="250px"
        on:textChange={e => onMetadataChanged(e.detail)}
      />
    </ExpansionPanel>
  </ExpansionPanels>
</div>
