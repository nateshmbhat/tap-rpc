<script lang="ts">
  import ServerConfigController from "../../../components/serverConfigController/ServerConfigController.svelte";
  import SendRequestButton from "../../../components/sendRequestButton/SendRequestButton.svelte";
  import { Col, Row } from "svelte-materialify/src";
  import GenericEditor from "../../../components/editors/GenericEditor.svelte";
  import { activeTabConfigStore } from "../../../../stores";
  import { onMount } from "svelte";
  import ClientMetadataEditor from "./components/ClientMetadataEditor.svelte";

  $: requestState = $activeTabConfigStore.clientRequestEditorState;
  $: responseState = $activeTabConfigStore.clientResponseEditorState;

  onMount(() => {
    activeTabConfigStore.setClientRequestEditorState({
      ...requestState,
      text: $activeTabConfigStore.selectedRpc!.mockRequestPayloadString
    });
  });

</script>

<div class="page">
  <ServerConfigController />
  <div class="row flex-expand">
    <div class="col flex-expand pb-0 pt-0">
      <GenericEditor
        text={requestState.text}
        on:textChange={e => {
          activeTabConfigStore.setClientRequestEditorState({
            ...requestState,
            text: e.detail
          });
        }}
      />
    </div>

    <div class="col flex-expand pb-0 pt-0">
      <GenericEditor
        text={responseState.text}
        on:textChange={e => {
          activeTabConfigStore.setClientResponseEditorState({
            ...responseState,
            text: e.detail
          });
        }}
      />
    </div>
  </div>

  <div class="center sendButton">
    <SendRequestButton />
  </div>

  <ClientMetadataEditor />
</div>

<style>
  .sendButton {
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
