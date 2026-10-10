<script lang="ts">
  import type { Component } from "svelte";
  import { Button, Icon } from "figma-ui3-kit-svelte";

  /**
   * Empty state display with optional icon and action buttons
   *
   * @example
   * <EmptyState
   *   message="No items found"
   *   icon={IconSearch}
   *   actions={[{ label: "Add Item", handler: handleAdd }]}
   * />
   */

  interface EmptyStateAction {
    label: string;
    handler: () => void;
  }

  interface Props {
    /** Message to display */
    message?: string;
    /** Optional icon: SVG markup, such as an icon from figma-ui3-kit-svelte/icons, or a component */
    icon?: string | Component | null;
    /** Icon size in px, for an icon given as SVG markup; the svg is scaled to it */
    iconSize?: number;
    /** Single action for backward compatibility { label, handler } */
    action?: EmptyStateAction | null;
    /** Multiple actions [{ label, handler }] */
    actions?: EmptyStateAction[] | null;
    /** Size variant */
    size?: "small" | "medium" | "large";
    /** Whether to center vertically */
    centered?: boolean;
    /** ARIA role: "status" for info messages, "alert" for errors */
    role?: "status" | "alert";
    class?: string;
  }

  let {
    message = "",
    icon = null,
    iconSize = 24,
    action = null,
    actions = null,
    size = "medium",
    centered = true,
    role = "status",
    class: className = "",
  }: Props = $props();

  let normalizedActions = $derived(
    actions ? actions : action ? [action] : null,
  );
</script>

<div
  class="empty-state {className}"
  class:centered
  class:small={size === "small"}
  class:large={size === "large"}
  {role}
>
  {#if icon}
    <div class="empty-state__icon" aria-hidden="true">
      {#if typeof icon === "string"}
        <Icon iconName={icon} size={iconSize} />
      {:else}
        {@const IconComponent = icon}
        <IconComponent />
      {/if}
    </div>
  {/if}

  <div class="empty-state__message">
    {message}
  </div>

  {#if normalizedActions && normalizedActions.length > 0}
    <div class="empty-state__actions">
      {#each normalizedActions as actionItem, i (i)}
        <Button variant="secondary" onclick={() => actionItem.handler()}>
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

  /* Icon sizes its box, but the svg keeps the 24px it's drawn at. */
  .empty-state__icon :global(.icon-component svg) {
    width: 100%;
    height: 100%;
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
