<script>
  import { activeTabConfigStore} from "../../../../../stores";
  import LiveEditCheckBox from "../components/LiveEditCheckBox.svelte";
  import GenericEditor from "../../../../components/editors/GenericEditor.svelte";
import { EditorDataFlowMode, IncomingRequest } from "../../../../components/types/types";


  const changeRequestMode = async (enableDataEdit: boolean) => {
    activeTabConfigStore.setMonitorRequestEditorState({
      ...$activeTabConfigStore.monitorRequestEditorState,
      dataFlowMode: enableDataEdit
        ? EditorDataFlowMode.liveEdit
        : EditorDataFlowMode.passThrough
    });
  };
  const requestEditDone = async () => {
    $activeTabConfigStore.monitorRequestEditorState.eventEmitter.emitEditingDone();
  };

  $: requestState = $activeTabConfigStore.monitorRequestEditorState;
  $: requestLiveEditEnabled = requestState.dataFlowMode == EditorDataFlowMode.liveEdit;

  let incomingRequest: IncomingRequest | undefined
  $: incomingRequest = requestState.incomingRequest

  function onRequestEditorChanged(newText : string){
    if(incomingRequest===undefined) return
    activeTabConfigStore.setMonitorRequestEditorState({
        ...requestState,
        incomingRequest: {...incomingRequest , text: newText}
      });
  }


</script>

{#if incomingRequest !== undefined}
  <LiveEditCheckBox
    checked={requestLiveEditEnabled}
    checkBoxLabel="Change Request"
    on:change={e => changeRequestMode(e.detail)}
    on:proceed={requestEditDone}
  />
  <GenericEditor
    text={incomingRequest.text}
    on:textChange={e => onRequestEditorChanged(e.detail)}
  />
{:else}
  <div class="center waiting-for-request">Waiting for Request...</div>
{/if}
