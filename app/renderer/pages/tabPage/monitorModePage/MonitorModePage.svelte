<script lang="ts">
  import ServerConfigController from "../../../components/serverConfigController/ServerConfigController.svelte";
  import { Row, Col } from "svelte-materialify/src";
  import RequestMonitor from "./components/RequestMonitor.svelte";
  import ResponseMonitor from "./components/ResponseMonitor.svelte";
  import MetadataMonitor from "./components/MetadataMonitor.svelte";

</script>

<div class="page">
  <ServerConfigController />
  <Row>
    <Col>
      <RequestMonitor />
    </Col>
    <Col>
      <ResponseMonitor />
    </Col>
  </Row>
  <MetadataMonitor />
</div>

<style>
  .page {
    height: calc(100vh - 52px);
    display: flex;
    flex-flow: column;
  }

</style>
