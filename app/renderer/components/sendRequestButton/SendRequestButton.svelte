<script>
  import { Button, Icon, ProgressCircular } from "svelte-materialify/src";
  import { activeTabConfigStore } from "../../../stores";
  import { ProtoUtil } from "../../../commons/utils";
  import { GrpcClientManager } from "../../behaviour/grpcClientManager";
  import { mdiPause, mdiPlay } from "@mdi/js";
  let requestInProgress = false;

  const setResponseEditorText = (text: string) => {
    activeTabConfigStore.setClientResponseEditorState({
      ...$activeTabConfigStore.clientResponseEditorState,
      text
    });
  };

  async function onClick(e: any) {
    const clientRequestState = $activeTabConfigStore.clientRequestEditorState;
    if (requestInProgress) {
      requestInProgress =false;
      clientRequestState.requestCallEventEmitter?.cancel()
      return;
    }
    requestInProgress = true;
    
    const eventEmitter = GrpcClientManager.sendRequest({
      requestMessage: clientRequestState.text,
      metadata: clientRequestState.metadata,
      url: $activeTabConfigStore.targetGrpcServerUrl,
      rpcProtoInfo: $activeTabConfigStore.selectedRpc!,
      tlsCertificate: $activeTabConfigStore.tlsCertificate,
      onError: (err, metaInfo) =>
        setResponseEditorText(ProtoUtil.stringify({ error: err.message })),
      onResponse: (response, metaInfo) =>
        setResponseEditorText(ProtoUtil.stringify(response)),
      onCallEnd: () => (requestInProgress = false)
    });

    activeTabConfigStore.setClientRequestEditorState({
      ...clientRequestState,
      requestCallEventEmitter : eventEmitter
    })
  }
</script>

<Button
  on:click={onClick}
  style="background-color:{requestInProgress ? 'red' : 'green'}"
  size="small"
  fab
>
  {#if requestInProgress}
    <Icon path={mdiPause} style="color:white;" />
  {:else}
    <Icon path={mdiPlay} style="color:white;" />
  {/if}
</Button>
