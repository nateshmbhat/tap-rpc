<script lang="ts">
  import {
    Button,
    Container,
    Icon,
    ProgressCircular,
  } from 'svelte-materialify/src'
  import {
    GRPCEventType,
    GRPCRequest,
    ResponseMetaInformation,
  } from '../../behaviour'
  import { activeTabConfigStore } from '../../../stores'
  import { each } from 'svelte/internal'
  import { ProtoUtil } from '../../../commons/utils'
  let requestInProgress = false

  const setResponseEditorText = (text: string) => {
    activeTabConfigStore.setResponseEditorState({
      ...$activeTabConfigStore.responseEditorState,
      text,
    })
  }

  async function onClick(e: any) {
    if (requestInProgress) return
    requestInProgress = true
    const requestModel = $activeTabConfigStore.requestEditorState
    const grpcRequest = new GRPCRequest({
      inputs: requestModel.text,
      metadata: requestModel.metadata,
      url: $activeTabConfigStore.targetGrpcServerUrl,
      rpcProtoInfo: $activeTabConfigStore.selectedRpc!,
    })

    grpcRequest.on(
      GRPCEventType.ERROR,
      (e: Error, metaInfo: ResponseMetaInformation) => {
        console.error('GRPC ERROR EVENT : ', e, metaInfo)
        setResponseEditorText(ProtoUtil.stringify({ error: e.message }))
      },
    )

    grpcRequest.on(
      GRPCEventType.DATA,
      (data: object, metaInfo: ResponseMetaInformation) => {
        if (metaInfo.stream) {
          //TODO : handle streaming call
        } else {
          console.log('Response : ', ProtoUtil.stringify(data))
          setResponseEditorText(ProtoUtil.stringify(data))
        }
      },
    )

    grpcRequest.on(GRPCEventType.END, () => {
      requestInProgress = false
      console.warn('GRPC End Event')
    })

    grpcRequest.send()
  }
</script>

<Button on:click={onClick} size='small' class="primary-color" fab>
  {#if requestInProgress}
    <ProgressCircular indeterminate color="primary" />
  {:else}
    <Icon class="mdi mdi-play" />
  {/if}
</Button>
