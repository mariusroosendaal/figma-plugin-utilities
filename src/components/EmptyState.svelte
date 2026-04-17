<script>
  import { Button, Icon } from "figma-ui3-kit-svelte";

  /**
   * Empty state display with optional icon and action buttons
   *
   * @example
   * <EmptyState
   *   message="No items found"
   *   icon="search"
   *   actions={[{ label: "Add Item", handler: handleAdd }]}
   * />
   */

  /** Message to display */
  export let message = "";

  /** Optional icon (string name or component) */
  export let icon = null;

  /** Single action for backward compatibility { label, handler } */
  export let action = null;

  /** Multiple actions [{ label, handler }] */
  export let actions = null;

  /** Size variant: 'small', 'medium', 'large' */
  export let size = "medium";

  /** Whether to center vertically */
  export let centered = true;

  let className = '';
  export { className as class };
  // Normalize actions
  $: normalizedActions = actions ? actions : action ? [action] : null;
</script>

<div
  class="empty-state {className}"
  class:centered
  class:small={size === "small"}
  class:large={size === "large"}
>
  {#if icon}
    <div class="empty-state__icon">
      {#if typeof icon === "string"}
        <Icon iconName={icon} />
      {:else}
        <svelte:component this={icon} />
      {/if}
    </div>
  {/if}

  <div class="empty-state__message">
    {message}
  </div>

  {#if normalizedActions && normalizedActions.length > 0}
    <div class="empty-state__actions">
      {#each normalizedActions as actionItem}
        <Button variant="secondary" on:click={actionItem.handler}>
          {actionItem.label}
        </Button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .empty-state {
    text-align: center;
    padding: var(--size-xsmall);
    color: var(--figma-color-text-secondary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-xsmall);
    font-family: var(--font-stack);
    text-wrap: balance;
    flex: 1;
  }

  .empty-state.centered {
    justify-content: center;
    align-items: center;
  }

  .empty-state.small {
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
  }

  .empty-state:not(.small):not(.large) {
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
  }

  .empty-state.large {
    font-size: var(--body-large-font-size);
    font-weight: var(--body-large-font-weight);
    letter-spacing: var(--body-large-letter-spacing);
    line-height: var(--body-large-line-height);
  }

  .empty-state__actions {
    display: flex;
    flex-direction: row;
    gap: var(--size-xxsmall);
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
