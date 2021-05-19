<script lang="ts">
  import ServerConfigController from "../../../components/serverConfigController/ServerConfigController.svelte";
  import SendRequestButton from "../../../components/sendRequestButton/SendRequestButton.svelte";
  import { Col, Row } from "svelte-materialify/src";
  import GenericEditor from "../../../components/editors/GenericEditor.svelte";
  import { activeTabConfigStore } from "../../../../stores";
  import { onMount } from "svelte";

  $: requestState = $activeTabConfigStore.clientRequestEditorState;
  $: responseState = $activeTabConfigStore.clientResponseEditorState;
  onMount(() => {
    activeTabConfigStore.setClientRequestEditorState({
      ...requestState,
      text: $activeTabConfigStore.selectedRpc!.mockRequestPayloadString
    });
  });

  function metaDataButtonClicked() {
    var content = document.getElementById("meta-data-content");

    if (content == null) return;
    if (content.style.maxHeight != null && content.style.maxHeight != "0px") {
      content.style.maxHeight = "0px";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }

</script>

<div class="page">
  <ServerConfigController />
  <div class="client-container">
    <Row style="height:100%;">
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

  <button
    class="primary-color"
    id="meta-data-button"
    on:click={metaDataButtonClicked}>Metadata</button
  >

  <div class="meta-data-Content" id="meta-data-content">
    <GenericEditor
      text={requestState.metadata}
      height="300"
      on:textChange={e => {
        activeTabConfigStore.setClientRequestEditorState({
          ...requestState,
          metadata: e.detail
        });
      }}
    />
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

  .meta-data-Content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    background-color: #f1f1f1;
  }

  #meta-data-button {
    cursor: pointer;
    color: #fff;
    padding: 8px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    font-weight: bold;
  }

</style>
