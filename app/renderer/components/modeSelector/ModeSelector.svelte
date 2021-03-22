<script lang="ts">
  import { onMount } from 'svelte'

  import {
    //@ts-ignore
    ButtonGroup,
    //@ts-ignore
    ButtonGroupItem,
  } from 'svelte-materialify/src'
  import { activeTabConfigStore, RpcOperationMode } from '../../../stores'
  let modeIndex: number = 0

  const modes = Object.values(RpcOperationMode)
  $: currentMode = $activeTabConfigStore.rpcOperationMode
  $: console.log('current mode : ', currentMode)

  $: console.log(
    'value = ',
    modeIndex,
    ' , modes = ',
    modes,
    ' , index(currentMode) =  ',
    modes.indexOf(currentMode),
  )

  onMount(() => {
    modeIndex = modes.indexOf(currentMode)
  })

  const changeMode = (e: any) => {
    console.log('changing mode : ', modeIndex, ', new mode index = ', e.detail)
    const selectedModeIndex = e.detail
    if (selectedModeIndex == null || selectedModeIndex < 0) return
    modeIndex = selectedModeIndex
    const selectedValue = RpcOperationMode[modes[modeIndex]]
    activeTabConfigStore.setRpcOperationMode(selectedValue)
  }
</script>

<ButtonGroup
  elevated
  mandatory
  activeClass="primary-color"
  value={modeIndex}
  on:change={changeMode}>
  {#each modes as mode (mode)}
    <ButtonGroupItem>{mode}</ButtonGroupItem>
  {/each}
</ButtonGroup>
<br />
