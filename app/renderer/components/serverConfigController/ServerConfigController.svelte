<script lang="ts">
  import { activeTabConfigStore, appConfigStore } from "../../../stores";
  import { Button, Card, Checkbox, TextField } from "svelte-materialify/src";
  import { CertificateUtil } from "../../../commons/utils/certificateUtil";
  import { Switch } from "svelte-materialify";
  $: targetServer = $activeTabConfigStore.targetGrpcServerUrl;
  $: tlsCert = $activeTabConfigStore.tlsCertificate;

  function onUseTlsCheckboxChanged() {
    if (tlsCert) {
      activeTabConfigStore.setTlsCertificate(undefined);
    } else {
      activeTabConfigStore.setTlsCertificate(
        CertificateUtil.getDefaultServerCertificate()
      );
    }
  }

  function onTargetServerChanged(inputElement: any) {
    activeTabConfigStore.setTargetGrpcServerUrl(inputElement.value);
  }

</script>

<Card class="align-self-center mb-1 pa-1 pl-2 pr-2">
  <div class="row">
    <div>
      <TextField
        value={targetServer}
        on:input={e => onTargetServerChanged(e.target)}
        placeholder="myserver.com:8080"
        dense
        filled>Target Server</TextField
      >
    </div>

    <Button
      on:click={onUseTlsCheckboxChanged}
      outlined
      rounded
      class="row pl-2 pr-2 pt-1 ml-2 align-self-center"
    >
      <Switch checked={tlsCert != undefined} />
      Use TLS
    </Button>
  </div>
</Card>
