<!-- Fields side by side in equal columns. -->
<script lang="ts">
  import type { Snippet } from "svelte";

  let { columns = 2, children }: { columns?: number; children?: Snippet } =
    $props();
</script>

<div class="grid" style:--columns={columns}>
  {@render children?.()}
</div>

<style>
  .grid {
    display: grid;
    /* minmax(0, 1fr), not 1fr: a bare 1fr track will not shrink below its
       content, and a field is wider than this panel. */
    grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
    gap: var(--size-xxsmall);
  }
</style>
