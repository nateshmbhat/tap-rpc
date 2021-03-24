<script lang="ts">
  import File from './File.svelte'
  import { ElectronUtil } from '../../../../commons/utils/electron_util'
  import { createEventDispatcher, onMount} from 'svelte'
  import type { RpcProtoInfo } from '../../../behaviour'
  import type { RpcSelectorFileType } from '../../types/types';

  export let expanded = false
  export let name: string
  export let files: RpcSelectorFileType[] = []
  let folderIconLocation =  `url(${ElectronUtil.getResourcePath()}/assets/icons/folder.svg)`
  let folderOpenIconLocation =  `url(${ElectronUtil.getResourcePath()}/assets/icons/folder-open.svg)`

  function toggle() {
    expanded = !expanded
  }

  const dispatch = createEventDispatcher<{fileClick:RpcProtoInfo}>()
</script>

<span
  id="folder-icon"
  style="--folderIcon: {folderIconLocation} ;--folderOpenIcon:{folderOpenIconLocation}"
  class:expanded
  on:click={toggle}
>
  {name}
</span>

{#if expanded}
  <ul>
    {#each files as file}
      <li>
        {#if file.type === "folder"}
          <svelte:self {...file} on:fileClick expanded />
        {:else}
          <File
            {...file}
            on:click={e => dispatch("fileClick", file.protoInfo)}
          />
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  span {
    padding: 0 0 0 1.5em;
    background: var(--folderIcon) 0 0.1em no-repeat;
    background-size: 1em 1em;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }

  .expanded {
    background-image: var(--folderOpenIcon);
  }

  ul {
    padding: 0.2em 0 0 0.5em;
    margin: 0 0 0 0.5em;
    list-style: none;
    border-left: 1px solid #eee;
  }

  li {
    padding: 0.2em 0;
  }
</style>
