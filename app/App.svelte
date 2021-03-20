<script lang="ts">
  import TapWire from './renderer/components/TapWire.svelte'
  import { MaterialApp } from 'svelte-materialify'
</script>

<style>
  :global(html, body) {
    position: relative;
    width: 100%;
    height: 100%;
  }

  :global(label) {
    display: block;
    user-select: none;
  }

  :global(.d-flex) {
    display: flex;
  }

  :global(.row) {
    display: flex;
    flex-direction: row;
  }
  :global(.col) {
    display: flex;
    flex-direction: column;
  }
  :global(.center) {
    text-align: center;
  }
  :global(.border){
    border: 1px solid black;
  }
</style>

<MaterialApp>
  <TapWire />
</MaterialApp>
