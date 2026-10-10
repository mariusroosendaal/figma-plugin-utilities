<script lang="ts">
  import type { Snippet } from "svelte";

  // Header component with left, center and right snippets

  interface Props {
    /** Additional CSS class */
    className?: string;
    /** Title text (displayed in left section) */
    title?: string;
    /** Remove bottom border */
    noBorder?: boolean;
    /** Heading level of the title: 1 for the plugin's own header, 2 or 3 for a bar inside a panel or modal */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** Before the title */
    left?: Snippet;
    center?: Snippet;
    right?: Snippet;
  }

  let {
    className = "",
    title = "",
    noBorder = false,
    level = 1,
    left,
    center,
    right,
  }: Props = $props();
</script>

<header
  class="header {className}"
  class:has-left-content={left}
  class:no-border={noBorder}
>
  <div class="header__left">
    {@render left?.()}
    {#if title}
      <svelte:element this={`h${level}`} class="header__title"
        >{title}</svelte:element
      >
    {/if}
  </div>
  <div class="header__center">
    {@render center?.()}
  </div>
  <div class="header__right">
    {@render right?.()}
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
