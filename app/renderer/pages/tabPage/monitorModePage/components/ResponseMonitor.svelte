<script lang="ts">
  import { activeTabConfigStore } from "../../../../../stores";
  import LiveEditCheckBox from "../components/LiveEditCheckBox.svelte";
  import GenericEditor from "../../../../components/editors/GenericEditor.svelte";
  import { EditorDataFlowMode } from "../../../../components/types/types";
  import ConnectionStatusIndicator from "./ConnectionStatusIndicator.svelte";

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

  let incomingResponseText: string | undefined;
  $: incomingResponseText = responseState.incomingResponseText;

  function onResponseEditorChanged(newText: string) {
    activeTabConfigStore.setMonitorResponseEditorState({
      ...responseState,
      incomingResponseText: newText
    });
  }

</script>

{#if incomingResponseText !== undefined}
  <div class="row align-center">
    <LiveEditCheckBox
      checked={responseLiveEditEnabled}
      checkBoxLabel="Change Response"
      connectionStatus={responseState.connectionStatus}
      on:change={e => changeResponseMode(e.detail)}
      on:proceed={responseEditDone}
    />
    <div class="mr-2" />
    <ConnectionStatusIndicator
      connectionStatus={responseState.connectionStatus}
    />
  </div>

  <GenericEditor
    text={incomingResponseText}
    on:textChange={e => onResponseEditorChanged(e.detail)}
  />
{:else}
  <div class="center waiting-for-response">Waiting for Response...</div>
{/if}
