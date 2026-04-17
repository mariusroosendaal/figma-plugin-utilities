<script>
  import { Label } from "figma-ui3-kit-svelte";

  /**
   * Field group wrapper
   * Wraps a form field with an optional label
   *
   * @example
   * <FieldGroup label="Collection">
   *   <Dropdown menuItems={options} bind:value={selected} />
   * </FieldGroup>
   */

  /** Label text (optional) */
  export let label = "";

  /** For attribute for the label (optional) */
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
