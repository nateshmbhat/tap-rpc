<script lang="ts">
  import { Button, Icon, Row } from "svelte-materialify/src";
  import { ProtoUtil } from "../../../commons/utils";
  import { FakerUtil } from "../../../commons/utils/util";
  import { activeTabConfigStore } from "../../../stores";
  import GenericEditor from "./GenericEditor.svelte";

  $: editorText = $activeTabConfigStore.mockRpcEditorText;
  const onEditorTextChanged = (msg: string) =>
    activeTabConfigStore.setMockRpcEditorText(msg);

  const onGenerateMockResponse = () => {
    const newResponse = FakerUtil.generateFakeJsonObject(
      JSON.parse(editorText)
    );
    activeTabConfigStore.setMockRpcEditorText(ProtoUtil.stringify(newResponse));
  };
</script>

<div class="box">
  <div class="center">
    <Button
      class="primary-color"
      on:click={onGenerateMockResponse}
      size="small"
      fab
    >
      <Icon class="mdi mdi-reload" />
    </Button>
  </div>

  <div class="mockEditor">
    <GenericEditor
      text={editorText}
      on:textChange={e => onEditorTextChanged(e.detail)}
    />
  </div>
</div>

<style>
  .mockEditor {
    flex-grow: 1;
  }
  .box {
    height: calc(100vh - 52px);
    display: flex;
    flex-direction: column;
  }
</style>
