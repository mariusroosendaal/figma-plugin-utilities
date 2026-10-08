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
   * `hint` slot takes markup and always shows. It takes the label's size, as
   * the control's error does: body-medium, or body-small in a small group.
   */
  export let hint = "";
</script>

<div class="field-group" class:small={size === "small"}>
  {#if label}
    <Label htmlFor={labelFor} {size}>{label}</Label>
  {/if}
  <slot />
  {#if $$slots.hint || hint}
    <Text
      class="field-group__hint"
      variant={size === "small" ? "body-small" : "body-medium"}
      color="--figma-color-text-secondary"
      block
    >
      <slot name="hint">{hint}</slot>
    </Text>
  {/if}
</div>

<style>
  /* The control's error takes the label's size, as the hint does. Read by
     the kit's Input, Textarea, Dropdown and Dropzone errors, and set on every
     group so a default group inside a small one is medium again. */
  .field-group {
    display: flex;
    flex-direction: column;
    gap: var(--size-xxsmall);
    --field-error-font-size: var(--body-medium-font-size);
    --field-error-font-weight: var(--body-medium-font-weight);
    --field-error-letter-spacing: var(--body-medium-letter-spacing);
    --field-error-line-height: var(--body-medium-line-height);
  }

  .field-group.small {
    gap: var(--size-xxxsmall);
    --field-error-font-size: var(--body-small-font-size);
    --field-error-font-weight: var(--body-small-font-weight);
    --field-error-letter-spacing: var(--body-small-letter-spacing);
    --field-error-line-height: var(--body-small-line-height);
  }

  /* Like the label, the hint is interface text, not content to copy */
  .field-group :global(.field-group__hint) {
    cursor: default;
    user-select: none;
  }
</style>
