<script>
  import { createEventDispatcher } from "svelte";
  import { IconButton, IconMore, Menu } from "figma-ui3-kit-svelte";

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
   *   on:click={handleSelect}
   *   on:menuSelect={handleMenuAction}
   * >
   *   <span>Additional info</span>
   * </ListItem>
   */

  const dispatch = createEventDispatcher();

  /** Unique identifier */
  export let id;

  /** Display title */
  export let title;

  /** Whether item is selected/active */
  export let active = false;

  /** Menu items [{ label, value }] */
  export let menuItems = [];

  /** Whether menu is open (bindable) */
  export let menuOpen = false;

  /** Reference to menu button element */
  export let menuButtonElement = null;

  /** Whether to show badge slot */
  export let hasBadge = false;

  let className = "";
  export { className as class };

  function handleClick() {
    dispatch("click", { id });
  }

  function handleMenuToggle(e) {
    e.stopPropagation();
    menuOpen = !menuOpen;
    dispatch("menuToggle", { id, open: menuOpen });
  }

  function handleMenuSelect(e) {
    dispatch("menuSelect", { id, action: e.detail.value });
    menuOpen = false;
  }

  function handleMenuClose() {
    menuOpen = false;
    dispatch("menuClose", { id });
  }
</script>

<div class="list-item-wrapper {className}">
  <div
    class="list-item"
    class:active
    on:click={handleClick}
    on:keydown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
    role="button"
    tabindex="0"
    aria-pressed={active}
  >
    <div class="list-item__content">
      <div class="list-item__title">{title}</div>
      {#if $$slots.default}
        <div class="list-item__meta">
          <slot />
        </div>
      {/if}
      {#if hasBadge && $$slots.badge}
        <div class="list-item__badge">
          <slot name="badge" />
        </div>
      {/if}
    </div>
  </div>

  {#if menuItems.length > 0}
    <IconButton
      iconName={IconMore}
      ariaLabel="{title} options"
      bind:element={menuButtonElement}
      on:click={handleMenuToggle}
    />
    <Menu
      bind:isOpen={menuOpen}
      {menuItems}
      anchorElement={menuButtonElement}
      on:select={handleMenuSelect}
      on:close={handleMenuClose}
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
    padding: var(--size-xxsmall);
    background: var(--figma-color-bg-secondary);
    border: 1px solid transparent;
    border-radius: var(--border-radius-medium);
    cursor: pointer;
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
