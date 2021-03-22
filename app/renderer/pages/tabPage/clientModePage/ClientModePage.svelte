<script lang="ts">
  import RequestEditor from '../../../components/editors/RequestEditor.svelte'
  import ResponseEditor from '../../../components/editors/ResponseEditor.svelte'
  import ServerConfigController from '../../../components/serverConfigController/ServerConfigController.svelte'
  import SendRequestButton from '../../../components/sendRequestButton/SendRequestButton.svelte'
  import { Row } from 'svelte-materialify/src'
</script>

<style>
  .client-container {
    position: relative;
  }
  .client-container .sendButton {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }
</style>

<div>
  <ServerConfigController />
  <div class="client-container">
    <Row>
      <RequestEditor />
      <ResponseEditor />
    </Row>
    <div class="center sendButton">
      <SendRequestButton />
    </div>
  </div>
</div>
