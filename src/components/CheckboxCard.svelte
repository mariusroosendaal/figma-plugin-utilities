<script>
  import { createEventDispatcher } from "svelte";
  import { Checkbox } from "figma-ui3-kit-svelte";

  /**
   * Large checkbox card component with better touch targets
   * Wraps the standard checkbox in a card-like layout
   *
   * @example
   * <CheckboxCard
   *   checked={isSelected}
   *   on:change={handleToggle}
   * >
   *   Small
   * </CheckboxCard>
   *
   * @example with secondary text
   * <CheckboxCard
   *   checked={isSelected}
   *   on:change={handleToggle}
   * >
   *   Small
   *   <svelte:fragment slot="secondary">400px</svelte:fragment>
   * </CheckboxCard>
   */

  const dispatch = createEventDispatcher();

  /** Whether checkbox is checked */
  export let checked = false;

  /** Whether checkbox is disabled */
  export let disabled = false;

  let cardEl;

  function handleChange(e) {
    if (disabled) return;
    checked = e.target.checked;
    dispatch("change", { checked });
  }

  function handleCardClick(e) {
    if (disabled) return;
    // Clicks inside the Checkbox component (label/input) are handled natively
    if (e.target.closest(".checkbox-container")) return;
    cardEl?.querySelector('input[type="checkbox"]')?.click();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<!-- Keyboard users interact with the native checkbox input inside; this div is a mouse-only larger click target -->
<div
  class="checkbox-card"
  class:disabled
  aria-disabled={disabled || undefined}
  bind:this={cardEl}
  on:click={handleCardClick}
>
  <Checkbox {checked} {disabled} on:change={handleChange}>
    <slot />
  </Checkbox>
  {#if $$slots.secondary}
    <div class="checkbox-card__secondary">
      <slot name="secondary" />
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

  /* Custom checkbox styling for card variant */
  .checkbox-card :global(.checkbox-box) {
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
