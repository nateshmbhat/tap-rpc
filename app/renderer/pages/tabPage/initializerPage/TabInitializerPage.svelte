<script lang="ts">
  import { Container, Divider } from "svelte-materialify/src";
  import { protoFilesStore } from "../../../../stores";
import type { ProtoFile } from "../../../behaviour";
  import ProtoImporter from "../../../components/protoImporter/ProtoImporter.svelte";
  import ProtoPathImporter from "../../../components/protoPathImporter/ProtoPathImporter.svelte";
  import RpcSelector from "../../../components/rpcSelector/RpcSelector.svelte";

  const onProtoLoaded = (protoFiles: ProtoFile[]) => {
    console.log(protoFiles);
  };
</script>

<Container>
  <ProtoPathImporter />
  <div class="ma-2" />
  <Divider />
  <ProtoImporter />
  <RpcSelector />
</Container>
