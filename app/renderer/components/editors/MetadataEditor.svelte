<script lang="ts">
  import { AceEditor } from 'svelte-ace'
  import { Button } from 'svelte-materialify/src'
  import {
    activeTabConfigStore,
    requestResponseEditorStore,
  } from '../../../stores'
  require('brace/mode/json')
  require('brace/theme/chrome')
  export let width = '100%'
  export let height = '512'
  const lang = 'json',
    theme = 'chrome'
  $: metadata = $requestResponseEditorStore.metadata
  const onEditorTextChanged = (msg: string) =>
    requestResponseEditorStore.setMetadata(msg)
</script>

<AceEditor
  on:input={(e) => onEditorTextChanged(e.detail)}
  value={metadata}
  {theme}
  {width}
  {lang}
  {height} />
