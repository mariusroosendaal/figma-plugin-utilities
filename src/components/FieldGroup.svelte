<script>
  import { Label } from "figma-ui3-kit-svelte";

  /** Label text (optional) */
  export let label = "";

  /** id of the associated control (optional) */
  export let labelFor = "";

  /** Size of the label (optional) */
  export let size = undefined;
</script>

<div class="field-group" class:small={size === "small"}>
  {#if label}
    <Label for={labelFor} {size}>{label}</Label>
  {/if}
  <slot />
</div>

<style>
  .field-group {
    display: flex;
    flex-direction: column;
    gap: var(--size-xxsmall);
  }

  .field-group.small {
    gap: var(--size-xxxsmall);
  }
</style>
