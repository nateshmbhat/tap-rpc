<script>
  import {
    activeTabConfigStore,
  } from '../../../stores'
  import TabInitializerPage from './initializerPage/TabInitializerPage.svelte'
  import ClientModePage from './clientModePage/ClientModePage.svelte'
  import MonitorModePage from './monitorModePage/MonitorModePage.svelte'
  import MockRpcModePage from './mockRpcModePage/MockRpcModePage.svelte'
  import { Tabs, TabContent, Tab } from 'svelte-materialify/src'
  import { RpcOperationMode } from '../../components/types/types';
  import { onMount } from 'svelte';
  import { appConfigStore } from '../../../stores/appConfigStore';
import MainTabContent from './MainTabContent.svelte'

  const allModes = Object.values(RpcOperationMode)
  console.log(
    'value = ',
    allModes.indexOf($activeTabConfigStore.rpcOperationMode),
  )
  const changeMode = (e: CustomEvent<number>) => {
    const newMode = allModes[e.detail]
    console.log('new mode = ', newMode)
    activeTabConfigStore.setRpcOperationMode(newMode)
  }

</script>

{#if $activeTabConfigStore.selectedRpc}
  <div>
    <Tabs
      vertical
      class="primary-text elevation-1"
      on:change={changeMode}
      value={allModes.indexOf($activeTabConfigStore.rpcOperationMode)}
    >
      <div slot="tabs">
        {#each allModes as mode, i (mode)}
          <Tab value={i}>
            <div style="text-transform:capitalize;">{mode}</div>
          </Tab>
        {/each}
      </div>
      <div class="ma-1">
        <MainTabContent />
      </div>
    </Tabs>
  </div>
{:else}
  <div>
    <TabInitializerPage />
  </div>
{/if}
