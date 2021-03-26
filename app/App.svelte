<script lang="ts">
  import TapRpc from './renderer/components/TapRpc.svelte'
  import { MaterialApp } from 'svelte-materialify'
</script>

<style global>
  html, body {
    position: relative;
    width: 100%;
    height: 100%;
  }

  label {
    display: block;
    user-select: none;
  }

  .d-flex {
    display: flex;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
  .col {
    display: flex;
    flex-direction: column;
  }
  .center {
    text-align: center;
  }
  .border{
    border: 1px solid black;
  }
</style>

<MaterialApp>
  <TapRpc />
</MaterialApp>
