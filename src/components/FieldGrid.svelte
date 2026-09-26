<!-- Fields side by side in equal columns. -->
<script>
  export let columns = 2;
</script>

<div class="grid" style:--columns={columns}>
  <slot />
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
