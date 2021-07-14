<script>
  import ClientModePage from './clientModePage/ClientModePage.svelte'
  import MonitorModePage from './monitorModePage/MonitorModePage.svelte'
  import MockRpcModePage from './mockRpcModePage/MockRpcModePage.svelte'
  import { Tabs, TabContent, Tab } from 'svelte-materialify/src'
  import { onMount } from 'svelte';
  import { appConfigStore,activeTabConfigStore } from '../../../stores';

  onMount(()=>{
    const targetServerUrl = $activeTabConfigStore.targetGrpcServerUrl
    if(targetServerUrl.trim().length==0){
      activeTabConfigStore.setTargetGrpcServerUrl($appConfigStore.defaultTargetServerUrl)
    }
  })
</script>

<TabContent>
  <MockRpcModePage />
</TabContent>
<TabContent>
  <MonitorModePage />
</TabContent>
<TabContent>
  <ClientModePage />
</TabContent>
