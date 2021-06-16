<script lang="ts">
  import ServerConfigController from "../../../components/serverConfigController/ServerConfigController.svelte";
  import { Row, Col } from "svelte-materialify/src";
  import RequestMonitor from "./components/RequestMonitor.svelte";
  import ResponseMonitor from "./components/ResponseMonitor.svelte";
  import MetadataMonitor from "./components/MetadataMonitor.svelte";

</script>

<div class="page">
  <ServerConfigController />
  <div class="row flex-expand">
    <div class="col flex-expand">
      <RequestMonitor />
    </div>
    <div class="col flex-expand">
      <ResponseMonitor />
    </div>
  </div>
  <MetadataMonitor />
</div>

<style>
  .page {
    height: calc(100vh - 52px);
    display: flex;
    flex-flow: column;
  }

</style>
