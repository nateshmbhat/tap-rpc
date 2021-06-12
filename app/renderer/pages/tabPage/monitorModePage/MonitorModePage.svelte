<script lang="ts">
  import ServerConfigController from "../../../components/serverConfigController/ServerConfigController.svelte";
  import { Row, Col, Button } from "svelte-materialify/src";
  import RequestMonitor from "./components/RequestMonitor.svelte";
  import ResponseMonitor from "./components/ResponseMonitor.svelte";

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
</div>

<style>
  .page {
    height: calc(100vh - 52px);
    display: flex;
    flex-flow: column;
  }

</style>
