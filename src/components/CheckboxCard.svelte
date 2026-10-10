<script lang="ts">
  import type { Snippet } from "svelte";
  import { Checkbox } from "figma-ui3-kit-svelte";

  /**
   * Large checkbox card component with better touch targets
   * Wraps the standard checkbox in a card-like layout
   *
   * @example
   * <CheckboxCard bind:checked={isSelected} onchange={handleToggle}>
   *   Small
   * </CheckboxCard>
   *
   * @example with secondary text
   * <CheckboxCard bind:checked={isSelected} onchange={handleToggle}>
   *   Small
   *   {#snippet secondary()}400px{/snippet}
   * </CheckboxCard>
   */

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    /** The label */
    children?: Snippet;
    /** A line under the label, such as a size */
    secondary?: Snippet;
    /** After `checked` updates */
    onchange?: (detail: { checked: boolean }) => void;
  }

  let {
    checked = $bindable(),
    disabled = false,
    children,
    secondary,
    onchange,
  }: Props = $props();

  let cardEl: HTMLDivElement | undefined = $state();

  function handleChange(e: Event & { currentTarget: HTMLInputElement }) {
    if (disabled) return;
    checked = e.currentTarget.checked;
    onchange?.({ checked });
  }

  function handleCardClick(e: MouseEvent) {
    if (disabled) return;
    // Clicks inside the Checkbox component (label/input) are handled natively
    if ((e.target as Element).closest(".checkbox-container")) return;
    cardEl?.querySelector<HTMLInputElement>('input[type="checkbox"]')?.click();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<!-- Keyboard users interact with the native checkbox input inside; this div is a mouse-only larger click target -->
<div
  class="checkbox-card"
  class:disabled
  aria-disabled={disabled || undefined}
  bind:this={cardEl}
  onclick={handleCardClick}
>
  <Checkbox {checked} {disabled} onchange={handleChange}>
    {@render children?.()}
  </Checkbox>
  {#if secondary}
    <div class="checkbox-card__secondary">
      {@render secondary()}
    </div>
  {/if}
</div>

<style>
  .checkbox-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--size-xxxsmall);
    background: var(--figma-color-bg-secondary);
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium);
    cursor: pointer;
    min-height: 24px;
    user-select: none;
  }

  .checkbox-card:hover {
    border-color: var(--figma-color-border);
    background: var(--figma-color-bg-secondary);
  }

  .checkbox-card.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Custom checkbox styling for card variant: an empty box takes the window's
     fill. Checkbox's own rules style the checked, mixed and disabled ones. */
  .checkbox-card :global(.checkbox-box:not(.checked, .mixed, .disabled)) {
    background-color: var(--figma-color-bg);
  }

  .checkbox-card__secondary {
    font-size: var(--body-small-font-size);
    font-weight: var(--body-small-font-weight);
    letter-spacing: var(--body-small-letter-spacing);
    line-height: var(--body-small-line-height);
    color: var(--figma-color-text-secondary);
    margin-left: auto;
    padding-left: var(--size-xsmall);
  }
</style>
