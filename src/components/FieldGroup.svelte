<script lang="ts">
  import type { Snippet } from "svelte";
  import { Label, Text } from "figma-ui3-kit-svelte";

  interface Props {
    /** Label text (optional) */
    label?: string;
    /** id of the associated control (optional) */
    labelFor?: string;
    /** Size of the label (optional) */
    size?: "medium" | "small";
    /**
     * A line under the control: what to enter, or what the choice does
     * (optional). An empty string shows none, so a conditional hint is a
     * string; a snippet takes markup and always shows. It takes the label's
     * size, as the control's error does: body-medium, or body-small in a
     * small group.
     */
    hint?: string | Snippet;
    /** The control */
    children?: Snippet;
  }

  let {
    label = "",
    labelFor = "",
    size = undefined,
    hint = "",
    children,
  }: Props = $props();
</script>

<div class="field-group" class:small={size === "small"}>
  {#if label}
    <Label htmlFor={labelFor} {size}>{label}</Label>
  {/if}
  {@render children?.()}
  {#if hint}
    <Text
      class="field-group__hint"
      variant={size === "small" ? "body-small" : "body-medium"}
      color="--figma-color-text-secondary"
      block
    >
      {#if typeof hint === "function"}{@render hint()}{:else}{hint}{/if}
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
