<script lang="ts">
  import {
    activeTabConfigStore,
  } from "../../../../../stores";
  import LiveEditCheckBox from "../components/LiveEditCheckBox.svelte";
  import GenericEditor from "../../../../components/editors/GenericEditor.svelte";
  import { EditorDataFlowMode, IncomingResponse } from "../../../../components/types/types";

  const changeResponseMode = async (enableDataEdit: boolean) => {
    activeTabConfigStore.setMonitorResponseEditorState({
      ...$activeTabConfigStore.monitorResponseEditorState,
      dataFlowMode: enableDataEdit
        ? EditorDataFlowMode.liveEdit
        : EditorDataFlowMode.passThrough
    });
  };

  const responseEditDone = async () => {
    $activeTabConfigStore.monitorResponseEditorState.eventEmitter.emitEditingDone();
  };

  $: responseState = $activeTabConfigStore.monitorResponseEditorState;
  $: responseLiveEditEnabled =
    responseState.dataFlowMode == EditorDataFlowMode.liveEdit;


 let incomingResponse: IncomingResponse | undefined
  $: incomingResponse = responseState.incomingResponse

  function onResponseEditorChanged(newText : string){
    if(incomingResponse===undefined) return
    activeTabConfigStore.setMonitorResponseEditorState({
        ...responseState,
        incomingResponse: {...incomingResponse , text: newText}
      });
  }
</script>

{#if incomingResponse !== undefined}
  <LiveEditCheckBox
    checked={responseLiveEditEnabled}
    checkBoxLabel="Change Response"
    on:change={e => changeResponseMode(e.detail)}
    on:proceed={responseEditDone}
  />
  <GenericEditor
    text={incomingResponse.text}
    on:textChange={e => onResponseEditorChanged(e.detail)}
  />
{:else}
  <div class="center waiting-for-response">Waiting for Response...</div>
{/if}
