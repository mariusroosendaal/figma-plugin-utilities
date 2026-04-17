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

  function handleCardClick(e) {
    if (disabled) return;
    
    // Don't toggle if clicking directly on the checkbox or label
    // (let the checkbox handle it natively)
    const target = e.target;
    const isCheckboxOrLabel = 
      target.tagName === "INPUT" || 
      target.tagName === "LABEL" ||
      target.closest("label");
    
    if (isCheckboxOrLabel) return;
    
    // Toggle and dispatch change event
    checked = !checked;
    dispatch("change", { checked });
  }
</script>

<div 
  class="checkbox-card" 
  class:disabled
  on:click={handleCardClick}
  on:keydown={(e) => e.key === "Enter" && handleCardClick(e)}
  role="button"
  tabindex={disabled ? -1 : 0}
>
  <Checkbox {checked} {disabled} on:change>
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
