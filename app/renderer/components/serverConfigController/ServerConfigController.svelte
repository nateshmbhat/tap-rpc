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

<Card class="mb-1 pa-1 pl-2 pr-2">
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

    <Switch class="ml-5" checked={tlsCert != undefined} on:change={onUseTlsCheckboxChanged}>
      Use TLS</Switch
    >
  </div>
</Card>
