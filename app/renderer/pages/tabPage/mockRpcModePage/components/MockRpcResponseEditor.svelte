<script lang="ts">
  import { mdiReload } from "@mdi/js";

  import { onMount } from "svelte";

  import { Button, Icon, Row } from "svelte-materialify/src";
  import { ProtoUtil } from "../../../../../commons/utils";
  import { FakerUtil } from "../../../../../commons/utils/util";
  import { activeTabConfigStore } from "../../../../../stores";
  import GenericEditor from "../../../../components/editors/GenericEditor.svelte";

  $: editorState = $activeTabConfigStore.mockRpcEditorState;

  onMount(() => {
    if ($activeTabConfigStore.selectedRpc != null) {
      activeTabConfigStore.setMockRpcEditorState({
        responseText:
          $activeTabConfigStore.selectedRpc.mockResponsePayloadString
      });
    }
  });

  const onEditorTextChanged = (msg: string) =>
    activeTabConfigStore.setMockRpcEditorState({
      responseText: msg,
      error: undefined
    });

  const onGenerateMockResponse = () => {
    const selectedRpc = $activeTabConfigStore.selectedRpc;
    if (selectedRpc == null) return;
    const newMockResponse = FakerUtil.getNewMockJsonObject(
      selectedRpc.mockResponseTemplate
    );
    activeTabConfigStore.setMockRpcEditorState({
      responseText: ProtoUtil.stringify(newMockResponse)
    });
  };

</script>

<div class="mockEditor">
  <GenericEditor
    text={editorState.responseText}
    on:textChange={e => onEditorTextChanged(e.detail)}
  />
  <div class="reload-button">
    <Button class="primary-color" on:click={onGenerateMockResponse} fab>
      <Icon path={mdiReload} />
    </Button>
  </div>
</div>

<style>
  .mockEditor {
    flex-grow: 1;
    position: relative;
  }
  .reload-button {
    opacity: 0.5;
    z-index: 10;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s;
  }
  .reload-button:hover {
    opacity: 1;
  }

</style>
