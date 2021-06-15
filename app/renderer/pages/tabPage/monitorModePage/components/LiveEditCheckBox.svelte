<script lang="ts">
  import { Button, Checkbox } from "svelte-materialify/src";
  import { Row, Col } from "svelte-materialify/src";
  import { createEventDispatcher } from "svelte";
  import { MonitorConnectionStatus } from "../../../../components/types/types";

  export let checked: boolean = false;
  export let checkBoxLabel: string = "Change Data";
  export let connectionStatus: MonitorConnectionStatus;

  const dispatch = createEventDispatcher<{ change: boolean; proceed: void }>();

  const onCheckboxChange = () => {
    checked = !checked;
    dispatch("change", checked);
  };
  const onProceedClicked = () => {
    dispatch("proceed");
  };

</script>

<Row>
  <Col>
    <Checkbox {checked} on:change={onCheckboxChange}>{checkBoxLabel}</Checkbox>
  </Col>
  {#if checked && connectionStatus === MonitorConnectionStatus.onHold}
    <div style={"flex-grow:0;"}>
      <Col class="ml-auto">
        <Button
          on:click={onProceedClicked}
          outlined
          rounded
          size="small"
          class="primary-color primary-text text-right"
        >
          Proceed
        </Button>
      </Col>
    </div>
  {/if}
</Row>
