<script lang="ts">
  import ServerConfigController from "../../../components/serverConfigController/ServerConfigController.svelte";
  import SendRequestButton from "../../../components/sendRequestButton/SendRequestButton.svelte";
  import { Col, Row } from "svelte-materialify/src";
  import GenericEditor from "../../../components/editors/GenericEditor.svelte";
  import { activeTabConfigStore } from "../../../../stores";

  $: requestState = $activeTabConfigStore.clientRequestEditorState;
  $: responseState = $activeTabConfigStore.clientResponseEditorState;
</script>

<div class="page">
  <ServerConfigController />
  <div class="client-container">
    <Row style='height:100%;'>
      <Col>
        <GenericEditor
          text={requestState.text}
          on:textChange={e => {
            activeTabConfigStore.setClientRequestEditorState({
              ...requestState,
              text: e.detail
            });
          }}
        />
      </Col>

      <Col>
        <GenericEditor
          text={responseState.text}
          on:textChange={e => {
            activeTabConfigStore.setClientResponseEditorState({
              ...responseState,
              text: e.detail
            });
          }}
        />
      </Col>
    </Row>
    <div class="center sendButton">
      <SendRequestButton />
    </div>
  </div>
</div>

<style>
  .client-container {
    position: relative;
    height: 100%;
  }
  .client-container .sendButton {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .page {
    height: calc(100vh - 52px);
    display: flex;
    flex-flow: column;
  }
</style>
