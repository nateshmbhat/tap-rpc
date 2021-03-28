<script lang="ts">
  import { activeTabConfigStore, EditorDataFlowMode } from "../../../../stores";
  import ServerConfigController from "../../../components/serverConfigController/ServerConfigController.svelte";
  import { Row, Col } from "svelte-materialify/src";
  import LiveEditCheckBox from "./components/LiveEditCheckBox.svelte";
  import GenericEditor from "../../../components/editors/GenericEditor.svelte";

  const changeRequestMode = async (enableDataEdit: boolean) => {
    activeTabConfigStore.setRequestEditorState({
      ...$activeTabConfigStore.monitorRequestEditorState,
      dataFlowMode: enableDataEdit
        ? EditorDataFlowMode.liveEdit
        : EditorDataFlowMode.passThrough
    });
  };
  const changeResponseMode = async (enableDataEdit: boolean) => {
    activeTabConfigStore.setResponseEditorState({
      ...$activeTabConfigStore.monitorRequestEditorState,
      dataFlowMode: enableDataEdit
        ? EditorDataFlowMode.liveEdit
        : EditorDataFlowMode.passThrough
    });
  };

  const requestEditDone = async () => {
    $activeTabConfigStore.monitorRequestEditorState.eventEmitter.emitEditingDone();
  };

  const responseEditDone = async () => {
    $activeTabConfigStore.monitorResponseEditorState.eventEmitter.emitEditingDone();
  };

  $: requestLiveEditEnabled =
    $activeTabConfigStore.monitorRequestEditorState.dataFlowMode ==
    EditorDataFlowMode.liveEdit;

  $: responseLiveEditEnabled =
    $activeTabConfigStore.monitorResponseEditorState.dataFlowMode ==
    EditorDataFlowMode.liveEdit;

  $: requestState = $activeTabConfigStore.monitorRequestEditorState;
  $: responseState = $activeTabConfigStore.monitorResponseEditorState;
</script>

<div class="page">
  <ServerConfigController />
  <Row>
    <Col>
      <LiveEditCheckBox
        checked={requestLiveEditEnabled}
        checkBoxLabel="Change Request"
        on:change={e => changeRequestMode(e.detail)}
        on:proceed={requestEditDone}
      />
      <GenericEditor
        text={requestState.text}
        on:textChange={e => {
          activeTabConfigStore.setRequestEditorState({
            ...requestState,
            text: e.detail
          });
        }}
      />
    </Col>
    <Col>
      <LiveEditCheckBox
        checked={responseLiveEditEnabled}
        checkBoxLabel="Change Response"
        on:change={e => changeResponseMode(e.detail)}
        on:proceed={responseEditDone}
      />

      <GenericEditor
        text={responseState.text}
        on:textChange={e => {
          activeTabConfigStore.setResponseEditorState({
            ...responseState,
            text: e.detail
          });
        }}
      />
    </Col>
  </Row>
</div>

<style>
  .page {
    height: calc(100vh - 52px);
    display: flex;
    flex-flow: column;
  }
</style>
