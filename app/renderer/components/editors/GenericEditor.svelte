<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { AceEditor } from "svelte-ace";
  require("brace/mode/json");
  require("brace/theme/chrome");
  export let width = "100%";
  export let height = "100%";
  const lang = "json",
    theme = "chrome";

  export let text = "";

  const dispatch = createEventDispatcher<{ textChange: string }>();
</script>

<AceEditor
  on:input={e => dispatch("textChange", e.detail)}
  value={text}
  {theme}
  {width}
  {lang}
  {height}
/>
