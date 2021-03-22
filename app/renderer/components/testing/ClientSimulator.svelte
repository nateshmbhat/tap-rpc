<script lang="ts">
  import { Button } from 'svelte-materialify/src'
  import {
    GRPCEventType,
    GRPCRequest,
    ResponseMetaInformation,
  } from '../../behaviour'
  import { appConfigStore, protoFilesStore } from '../../../stores'
  import { ProtoUtil } from '../../../commons/utils'
  let buttonMessage = 'say Hello Client call'

  async function onClick(e: any) {
    const appConfig = await appConfigStore.getValue()
    const protoFiles = await protoFilesStore.getValue()

    console.log('proto service : ', protoFiles[0].services)
    const grpcRequest = new GRPCRequest({
      inputs: ProtoUtil.stringify({ name: 'Hello' }),
      metadata: ProtoUtil.stringify({}),
      url: appConfig.mockGrpcServerUrl,
      rpcProtoInfo:
        protoFiles[0].services['hello_world.Greeter'].methods['SayHello'],
    })

    grpcRequest.on(
      GRPCEventType.ERROR,
      (e: Error, metaInfo: ResponseMetaInformation) => {
        console.error('GRPC ERROR EVENT : ', e, metaInfo)
      },
    )

    grpcRequest.on(
      GRPCEventType.DATA,
      (data: object, metaInfo: ResponseMetaInformation) => {
        if (metaInfo.stream) {
          //TODO : handle streaming call
        } else {
          buttonMessage = ProtoUtil.stringify(data)
        }
      },
    )

    grpcRequest.on(GRPCEventType.END, () => {
      console.warn('GRPC End Event')
    })

    grpcRequest.send()
  }
</script>

<Button on:click={onClick}>{buttonMessage}</Button>
