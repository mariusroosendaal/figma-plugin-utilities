<script>
  // Header component with left/center/right slots

  /** Additional CSS class */
  export let className = "";

  /** Title text (displayed in left section) */
  export let title = "";

  /** Remove bottom border */
  export let noBorder = false;
</script>

<header
  class="header {className}"
  class:has-left-content={$$slots.left}
  class:no-border={noBorder}
>
  <div class="header__left">
    <slot name="left" />
    {#if title}
      <h1 class="header__title">{title}</h1>
    {/if}
  </div>
  <div class="header__center">
    <slot name="center" />
  </div>
  <div class="header__right">
    <slot name="right" />
  </div>
</header>

<style>
  .header {
    height: var(--size-large);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--size-xxsmall) 0 var(--size-xsmall);
    border-bottom: 1px solid var(--figma-color-border);
    background: var(--figma-color-bg);
    gap: var(--size-xsmall);
  }

  .header.has-left-content {
    padding-left: var(--size-xxsmall);
  }

  .header.no-border {
    border-bottom: none;
  }

  .header__left {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall);
  }

  .header__center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header__title {
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    color: var(--figma-color-text);
    margin: 0;
  }

  .header__right {
    display: flex;
    align-items: center;
    gap: var(--size-xxsmall);
    position: relative;
  }
</style>
