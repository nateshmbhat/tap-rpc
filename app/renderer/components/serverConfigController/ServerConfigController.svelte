<script lang="ts">
  import { activeTabConfigStore, appConfigStore } from "../../../stores";
  import { Checkbox } from "svelte-materialify/src";
  import { CertificateUtil } from "../../../commons/utils/certificateUtil";
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

</script>

<div class="row">
  <div>
    <label for="target-server">Target Server</label>
    <input
      on:input={e =>
        activeTabConfigStore.setTargetGrpcServerUrl(e.currentTarget.value)}
      value={targetServer}
      name="target-server"
      placeholder="Target server"
    />
  </div>

  <div>
    <Checkbox checked={tlsCert != undefined} on:change={onUseTlsCheckboxChanged}
      >Use TLS</Checkbox
    >
  </div>
</div>
