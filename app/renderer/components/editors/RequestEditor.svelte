<script lang="ts">
  import { AceEditor } from 'svelte-ace'
  import { Button, Col, Icon, Row } from 'svelte-materialify/src'
  import {
    requestResponseEditorStore,
  } from '../../../stores'
  require('brace/mode/json')
  require('brace/theme/chrome')
  export let width = '100%'
  const lang = 'json',
    theme = 'chrome'

  $: requestMessage = $requestResponseEditorStore.request.text
  const onEditorTextChanged = (msg: string) =>
    requestResponseEditorStore.setRequest(msg)

</script>

<Row>
  <Col>
    <AceEditor
      on:input={(e) => onEditorTextChanged(e.detail)}
      value={requestMessage}
      {theme}
      {width}
      {lang}
      height="800" />
  </Col>
</Row>
