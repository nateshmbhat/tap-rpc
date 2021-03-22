<script lang="ts">
  import {
    activeTabConfigStore,
    requestResponseEditorStore,
    RpcOperationMode,
  } from '../../../stores'
  import TabInitializerPage from './initializerPage/TabInitializerPage.svelte'
  import ClientModePage from './clientModePage/ClientModePage.svelte'
  import MonitorModePage from './monitorModePage/MonitorModePage.svelte'
  import MockRpcModePage from './mockRpcModePage/MockRpcModePage.svelte'
  import { Tabs, TabContent, Tab } from 'svelte-materialify/src'

  const allModes = Object.values(RpcOperationMode)
  console.log(
    'value = ',
    allModes.indexOf($activeTabConfigStore.rpcOperationMode),
  )
  const changeMode = (e: CustomEvent<number>) => {
    const newMode = allModes[e.detail]
    console.log('new mode = ', newMode)

    const selectedRpc = $activeTabConfigStore.selectedRpc
    if (selectedRpc != null) {
      switch (newMode) {
        case RpcOperationMode.client:
          requestResponseEditorStore.setRequest(
            selectedRpc.mockRequestPayloadString,
          )
          break
        case RpcOperationMode.monitor:
          requestResponseEditorStore.setRequest('')
          requestResponseEditorStore.setResponse('')
          break
      }
    }
    activeTabConfigStore.setRpcOperationMode(newMode)
  }
</script>

{#if $activeTabConfigStore.selectedRpc}
  <div>
    <Tabs
      vertical
      class="primary-text"
      on:change={changeMode}
      value={allModes.indexOf($activeTabConfigStore.rpcOperationMode)}>
      <div slot="tabs">
        {#each allModes as mode, i (mode)}
          <Tab value={i}>
            <div style='text-transform:capitalize;'>{mode}</div>
          </Tab>
        {/each}
      </div>
      <div class="ma-1">
        <TabContent>
          <MockRpcModePage />
        </TabContent>
        <TabContent>
          <MonitorModePage />
        </TabContent>
        <TabContent>
          <ClientModePage />
        </TabContent>
      </div>

    </Tabs>
  </div>
{:else}
  <div>
    <TabInitializerPage />
  </div>
{/if}
