<script lang="ts">
  import { activeTabConfigStore, EditorDataFlowMode } from '../../../../stores'
  import RequestEditor from '../../../components/editors/RequestEditor.svelte'
  import ResponseEditor from '../../../components/editors/ResponseEditor.svelte'
  import ServerConfigController from '../../../components/serverConfigController/ServerConfigController.svelte'
  import { Row, Col } from 'svelte-materialify/src'
  import LiveEditCheckBox from './components/LiveEditCheckBox.svelte'

  const changeRequestMode = async (enableDataEdit: boolean) => {
    activeTabConfigStore.setRequestEditorState({
      ...$activeTabConfigStore.requestEditorState,
      dataFlowMode: enableDataEdit
        ? EditorDataFlowMode.liveEdit
        : EditorDataFlowMode.passThrough,
    })
  }
  const changeResponseMode = async (enableDataEdit: boolean) => {
    activeTabConfigStore.setResponseEditorState({
      ...$activeTabConfigStore.responseEditorState,
      dataFlowMode: enableDataEdit
        ? EditorDataFlowMode.liveEdit
        : EditorDataFlowMode.passThrough,
    })
  }

  const requestEditDone = async () => {
    $activeTabConfigStore.requestEditorState.eventEmitter.emitEditingDone()
  }

  const responseEditDone = async () => {
    $activeTabConfigStore.responseEditorState.eventEmitter.emitEditingDone()
  }

  $: requestLiveEditEnabled =
    $activeTabConfigStore.requestEditorState.dataFlowMode ==
    EditorDataFlowMode.liveEdit

  $: responseLiveEditEnabled =
    $activeTabConfigStore.responseEditorState.dataFlowMode ==
    EditorDataFlowMode.liveEdit
</script>

<div>
  <ServerConfigController />
  <Row>
    <Col>
      <LiveEditCheckBox
        checked={requestLiveEditEnabled}
        checkBoxLabel='Change Request'
        on:change={(e) => changeRequestMode(e.detail)}
        on:proceed={requestEditDone} />
      <RequestEditor />
    </Col>
    <Col>
      <LiveEditCheckBox
        checked={responseLiveEditEnabled}
        checkBoxLabel='Change Response'
        on:change={(e) => changeResponseMode(e.detail)}
        on:proceed={responseEditDone} />
      <ResponseEditor />
    </Col>
  </Row>
</div>
