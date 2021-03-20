<script lang="ts">
  import { ElectronUtil } from "../../../../commons/utils/electron_util";
  export let name: string;
  $: fileExtension = name.slice(name.lastIndexOf(".") + 1);
</script>

<span
  on:click
  style="background-image: url({ElectronUtil.getResourcePath()}/icons/file.svg)"
>
  {name}
</span>

<style>
  span {
    padding: 0 0 0 1.5em;
    background: 0 0.1em no-repeat;
    background-size: 1em 1em;
    user-select: none;
    cursor: pointer;
  }
</style>
