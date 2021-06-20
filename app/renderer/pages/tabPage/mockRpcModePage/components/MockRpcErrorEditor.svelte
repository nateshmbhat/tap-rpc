<script lang="ts">
  import { onMount } from "svelte";

  import { ProgressCircular, Select, TextField } from "svelte-materialify/src";
  import { activeTabConfigStore } from "../../../../../stores";

  const items = [
    { name: "1 	: CANCELLED", value: "1" },
    { name: "2 	: UNKNOWN", value: "2" },
    { name: "3 	: INVALID_ARGUMENT", value: "3" },
    { name: "4 	: DEADLINE_EXCEEDED", value: "4" },
    { name: "5 	: NOT_FOUND", value: "5" },
    { name: "6 	: ALREADY_EXISTS", value: "6" },
    { name: "7 	: PERMISSION_DENIED", value: "7" },
    { name: "8 	: RESOURCE_EXHAUSTED", value: "8" },
    { name: "9 	: FAILED_PRECONDITION", value: "9" },
    { name: "10 : ABORTED", value: "10" },
    { name: "11 : OUT_OF_RANGE", value: "11" },
    { name: "12 : UNIMPLEMENTED", value: "12" },
    { name: "13 : INTERNAL", value: "13" },
    { name: "14 : UNAVAILABLE", value: "14" },
    { name: "15 : DATA_LOSS", value: "15" },
    { name: "16 : UNAUTHENTICATED", value: "16" }
  ];

  $: error = $activeTabConfigStore.mockRpcEditorState.error;

  function onErrorCodeItemSelected(selectedValue: string) {
    if (
      !selectedValue ||
      typeof selectedValue !== "string" ||
      selectedValue.length < 1 ||
      error === undefined
    )
      return;
    activeTabConfigStore.setMockRpcEditorState({
      responseText: "",
      error: {
        ...error,
        code: parseInt(selectedValue)
      }
    });
  }

  function onErrorDetailChanged(inputElement: any) {
    if (error === undefined) return;
    activeTabConfigStore.setMockRpcEditorState({
      responseText: "",
      error: {
        ...error,
        details: inputElement.value
      }
    });
  }

  onMount(() => {
    if (error === undefined) {
      activeTabConfigStore.setMockRpcEditorState({
        responseText: "",
        error: {
          code: 1,
          details: "This is a sample error message"
        }
      });
    }
  });

</script>

{#if error !== undefined}
  <div class="col">
    <Select
      filled
      {items}
      value={error.code.toString()}
      on:change={info => onErrorCodeItemSelected(info.detail)}
      >Error code</Select
    >
    <div class="ma-3" />
    <TextField
      value={error.details}
      on:change={e => onErrorDetailChanged(e.target)}
      placeholder="Auth token is expired !"
      filled>Error detail</TextField
    >
  </div>
{:else}
  <ProgressCircular indeterminate size={50} color="primary" />
{/if}
