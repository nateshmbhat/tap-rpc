<script>
  import { activeTabConfigStore} from "../../../../../stores";
  import LiveEditCheckBox from "../components/LiveEditCheckBox.svelte";
  import GenericEditor from "../../../../components/editors/GenericEditor.svelte";
  import { EditorDataFlowMode, IncomingRequest, MonitorConnectionStatus } from "../../../../components/types/types";
  import ConnectionStatusIndicator from "./ConnectionStatusIndicator.svelte";

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
  <div class="row align-center">
    <LiveEditCheckBox
      checked={requestLiveEditEnabled}
      checkBoxLabel="Change Request"
      connectionStatus={requestState.connectionStatus}
      on:change={e => changeRequestMode(e.detail)}
      on:proceed={requestEditDone}
    />
    <div class="mr-2"></div>
    <ConnectionStatusIndicator
      connectionStatus={requestState.connectionStatus}
    />
  </div>

  <GenericEditor
    text={incomingRequest.text}
    on:textChange={e => onRequestEditorChanged(e.detail)}
  />
{:else}
  <div class="center waiting-for-request">Waiting for Request...</div>
{/if}
