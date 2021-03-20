<script lang="ts">
  import { AceEditor } from 'svelte-ace'
  import { Button, Col, Row } from 'svelte-materialify/src'
  import {
    activeTabConfigStore,
    requestResponseEditorStore,
  } from '../../../stores'
  require('brace/mode/json')
  require('brace/theme/chrome')
  export let width = '100%'
  const lang = 'json',
    theme = 'chrome'

  $: responseMessage = $requestResponseEditorStore.response.text
  const onEditorTextChanged = (msg: string) =>
    requestResponseEditorStore.setResponse(msg)
</script>

<Row>
  <Col>
    <AceEditor
      on:input={(e) => onEditorTextChanged(e.detail)}
      value={responseMessage}
      {theme}
      {width}
      {lang}
      height="620" />

  </Col>
</Row>
