<script>
  import { Label, Text } from "figma-ui3-kit-svelte";

  /** Label text (optional) */
  export let label = "";

  /** id of the associated control (optional) */
  export let labelFor = "";

  /** Size of the label (optional) */
  export let size = undefined;

  /**
   * A line under the control: what to enter, or what the choice does
   * (optional). Empty shows none, so a conditional hint is a string; the
   * `hint` slot takes markup and always shows.
   */
  export let hint = "";
</script>

<div class="field-group" class:small={size === "small"}>
  {#if label}
    <Label htmlFor={labelFor} {size}>{label}</Label>
  {/if}
  <slot />
  {#if $$slots.hint || hint}
    <Text variant="body-small" color="--figma-color-text-secondary" block>
      <slot name="hint">{hint}</slot>
    </Text>
  {/if}
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
