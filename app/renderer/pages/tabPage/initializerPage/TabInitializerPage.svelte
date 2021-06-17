<script lang="ts">
  import {
    Container,
    Divider,
    TextField,
    Tooltip
  } from "svelte-materialify/src";
  import { appConfigStore } from "../../../../stores/tabStore";
  import ProtoImporter from "../../../components/protoImporter/ProtoImporter.svelte";
  import ProtoPathImporter from "../../../components/protoPathImporter/ProtoPathImporter.svelte";
  import RpcSelector from "../../../components/rpcSelector/RpcSelector.svelte";

  function onTargetServerChanged(inputElement: any) {
    appConfigStore.setDefaultTargetServerUrl(inputElement.value);
  }

</script>

<Container>
  <TextField
    value={$appConfigStore.defaultTargetServerUrl}
    on:input={e => onTargetServerChanged(e.target)}
    placeholder="myserver.com:8080"
    dense
    filled>Default Target Server</TextField
  >

  <div class="ma-1" />
  <Divider />
  <ProtoPathImporter />
  <div class="ma-2" />
  <Divider />
  <ProtoImporter />
  <RpcSelector />
</Container>
