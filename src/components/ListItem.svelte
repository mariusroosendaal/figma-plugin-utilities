<script lang="ts" generics="T extends MenuOption = MenuOption">
  import type { Snippet } from "svelte";
  import { IconButton, Menu, type MenuOption } from "figma-ui3-kit-svelte";
  import { IconMore } from "figma-ui3-kit-svelte/icons";

  /**
   * List item with optional action menu
   *
   * @example
   * <ListItem
   *   id="item-1"
   *   title="My Item"
   *   active={selectedId === 'item-1'}
   *   menuItems={[
   *     { label: 'Edit', value: 'edit' },
   *     { label: 'Delete', value: 'delete' }
   *   ]}
   *   onclick={handleSelect}
   *   onmenuselect={handleMenuAction}
   * >
   *   <span>Additional info</span>
   *   {#snippet actions()}
   *     <Button variant="secondary" onclick={fill}>Fill</Button>
   *   {/snippet}
   * </ListItem>
   */

  interface Props {
    /** Unique identifier */
    id: string;
    /** Display title */
    title: string;
    /** Whether item is selected/active */
    active?: boolean;
    /** Menu items [{ label, value }] */
    menuItems?: T[];
    /** Whether menu is open (bindable) */
    menuOpen?: boolean;
    /** Reference to menu button element */
    menuButtonElement?: HTMLButtonElement | null;
    /** Whether to show the badge snippet */
    hasBadge?: boolean;
    class?: string;
    /** Under the title */
    children?: Snippet;
    badge?: Snippet;
    /** Beside the clickable area */
    actions?: Snippet;
    /** The item, by click or Enter */
    onclick?: (detail: { id: string }) => void;
    /** The menu button, after `menuOpen` updates */
    onmenutoggle?: (detail: { id: string; open: boolean }) => void;
    /** A menu row: its `value` */
    onmenuselect?: (detail: { id: string; action: T["value"] }) => void;
    /** The menu closed, after `menuOpen` turns false */
    onmenuclose?: (detail: { id: string }) => void;
  }

  let {
    id,
    title,
    active = false,
    menuItems = [],
    menuOpen = $bindable(),
    menuButtonElement = $bindable(),
    hasBadge = false,
    class: className = "",
    children,
    badge,
    actions,
    onclick,
    onmenutoggle,
    onmenuselect,
    onmenuclose,
  }: Props = $props();

  function handleClick() {
    onclick?.({ id });
  }

  function handleMenuToggle(e: MouseEvent) {
    e.stopPropagation();
    menuOpen = !menuOpen;
    onmenutoggle?.({ id, open: menuOpen });
  }

  // The menu closes itself after a pick, and calls handleMenuClose
  function handleMenuSelect(item: T) {
    onmenuselect?.({ id, action: item.value });
  }

  function handleMenuClose() {
    menuOpen = false;
    onmenuclose?.({ id });
  }
</script>

<div class="list-item-wrapper {className}">
  <!-- The actions sit in the card beside the clickable area, not inside it:
       a button can't be nested in another button -->
  <div class="list-item" class:active>
    <div
      class="list-item__main"
      onclick={handleClick}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabindex="0"
      aria-pressed={active}
    >
      <div class="list-item__content">
        <div class="list-item__title">{title}</div>
        {#if children}
          <div class="list-item__meta">
            {@render children()}
          </div>
        {/if}
        {#if hasBadge && badge}
          <div class="list-item__badge">
            {@render badge()}
          </div>
        {/if}
      </div>
    </div>
    {#if actions}
      <div class="list-item__actions">
        {@render actions()}
      </div>
    {/if}
  </div>

  {#if menuItems.length > 0}
    <IconButton
      iconName={IconMore}
      ariaLabel="{title} options"
      bind:element={menuButtonElement}
      onclick={handleMenuToggle}
    />
    <Menu
      bind:isOpen={menuOpen}
      {menuItems}
      anchorElement={menuButtonElement}
      onselect={handleMenuSelect}
      onclose={handleMenuClose}
    />
  {/if}
</div>

<style>
  .list-item-wrapper {
    display: flex;
    align-items: center;
    gap: var(--size-xxxsmall);
    padding: var(--size-xxxsmall) 0;
  }

  .list-item {
    flex: 1;
    display: flex;
    align-items: center;
    background: var(--figma-color-bg-secondary);
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium);
    transition: border-color 0.15s ease;
    min-width: 0;
  }

  .list-item:hover {
    border-color: var(--figma-color-border-selected);
  }

  .list-item.active {
    border-color: var(--figma-color-border-brand-strong);
    background: var(--figma-color-bg-brand-tertiary);
  }

  .list-item__main {
    flex: 1;
    display: flex;
    align-items: center;
    padding: var(--size-xxsmall);
    border-radius: inherit;
    cursor: pointer;
    min-width: 0;
  }

  /* The main area's own padding spaces them from the text */
  .list-item__actions {
    display: flex;
    align-items: center;
    gap: var(--size-xxxsmall);
    padding-right: var(--size-xxsmall);
  }

  .list-item__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--size-xxxsmall);
    min-width: 0;
  }

  .list-item__title {
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-item__meta {
    display: flex;
    align-items: center;
    gap: var(--size-xxxsmall);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    color: var(--figma-color-text-secondary);
  }

  .list-item__badge {
    display: block;
    min-width: 0;
    overflow: hidden;
  }
</style>
