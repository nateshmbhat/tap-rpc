<script lang="ts">
  import { AceEditor } from 'svelte-ace'
  import { Button, Icon, Row } from 'svelte-materialify/src'
  import { ProtoUtil } from '../../../commons/utils'
  import { FakerUtil } from '../../../commons/utils/util'
  import { activeTabConfigStore } from '../../../stores'

  require('brace/mode/json')
  require('brace/theme/chrome')

  $: editorText = $activeTabConfigStore.mockRpcEditorText

  const lang = 'json',
    theme = 'chrome'

  const onEditorTextChanged = (msg: string) =>
    activeTabConfigStore.setMockRpcEditorText(msg)

  const onGenerateMockResponse = () => {
    const newResponse = FakerUtil.generateFakeJsonObject(JSON.parse(editorText))
    activeTabConfigStore.setMockRpcEditorText(ProtoUtil.stringify(newResponse))
  }
</script>

<div class="center">
  <Button class='primary-color' on:click={onGenerateMockResponse} size="small" fab>
    <Icon class="mdi mdi-reload" />
  </Button>
</div>
<div class="ma-2" />

<Row>
  <AceEditor
    on:input={(e) => onEditorTextChanged(e.detail)}
    value={editorText}
    {theme}
    {lang}
    width={'100%'}
    height="620" />
</Row>
