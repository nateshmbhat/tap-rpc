<script lang="ts">
  export let name: string;
</script>

<span
  on:click
  style="background-image: url(__ASSET_PATH__/icons/file.svg)"
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
