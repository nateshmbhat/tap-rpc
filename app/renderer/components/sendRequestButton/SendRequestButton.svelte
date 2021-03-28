<script>
  import { Button, Icon, ProgressCircular } from "svelte-materialify/src";
  import { activeTabConfigStore } from "../../../stores";
  import { ProtoUtil } from "../../../commons/utils";
  import { GrpcClientManager } from "../../behaviour/grpcClientManager";
  let requestInProgress = false;

  const setResponseEditorText = (text: string) => {
    activeTabConfigStore.setClientResponseEditorState({
      ...$activeTabConfigStore.clientResponseEditorState,
      text
    });
  };

  async function onClick(e: any) {
    if (requestInProgress) return;
    requestInProgress = true;
    const requestModel = $activeTabConfigStore.clientRequestEditorState;
    GrpcClientManager.sendRequest({
      requestMessage: requestModel.text,
      metadata: requestModel.metadata,
      url: $activeTabConfigStore.targetGrpcServerUrl,
      rpcProtoInfo: $activeTabConfigStore.selectedRpc!,
      onError: (err, metaInfo) =>
        setResponseEditorText(ProtoUtil.stringify({ error: e.message })),
      onResponse: (response, metaInfo) =>
        setResponseEditorText(ProtoUtil.stringify(response)),
      onCallEnd: () => (requestInProgress = false)
    });
  }
</script>

<Button on:click={onClick} size="small" class="primary-color" fab>
  {#if requestInProgress}
    <ProgressCircular indeterminate color="primary" />
  {:else}
    <Icon class="mdi mdi-play" />
  {/if}
</Button>
