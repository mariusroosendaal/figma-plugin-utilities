<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * Plugin footer with layout variants
   *
   * @example
   * <!-- Right-aligned (default) -->
   * <Footer>
   *   <Button>Save</Button>
   * </Footer>
   *
   * <!-- Split layout -->
   * <Footer variant="split">
   *   {#snippet left()}
   *     <Button variant="secondary">Cancel</Button>
   *   {/snippet}
   *   {#snippet right()}
   *     <Button variant="primary">Save</Button>
   *   {/snippet}
   * </Footer>
   *
   * <!-- Full width buttons -->
   * <Footer variant="full">
   *   <Button variant="primary">Create item</Button>
   * </Footer>
   */

  interface Props {
    /** Layout variant */
    variant?: "right" | "split" | "full";
    /** Additional CSS class */
    className?: string;
    /** The buttons, for the right and full variants */
    children?: Snippet;
    /** Split variant */
    left?: Snippet;
    /** Split variant */
    right?: Snippet;
  }

  let {
    variant = "right",
    className = "",
    children,
    left,
    right,
  }: Props = $props();
</script>

<footer class="footer footer--{variant} {className}">
  {#if variant === "right"}
    <div class="footer__right">
      {@render children?.()}
    </div>
  {:else if variant === "split"}
    <div class="footer__left">
      {@render left?.()}
    </div>
    <div class="footer__right">
      {@render right?.()}
    </div>
  {:else if variant === "full"}
    {@render children?.()}
  {/if}
</footer>

<style>
  .footer {
    height: var(--size-large);
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: var(--size-xxsmall);
    padding: var(--size-xxsmall);
    border-top: 1px solid var(--figma-color-border);
    background: var(--figma-color-bg);
    z-index: 10;
  }

  .footer :global(> *),
  .footer :global(> * > *) {
    display: flex;
    gap: var(--size-xxsmall);
    align-items: center;
    min-width: 0;
  }

  .footer--right {
    justify-content: flex-end;
  }

  .footer--right .footer__right {
    display: flex;
    gap: var(--size-xxsmall);
    align-items: center;
  }

  .footer--split {
    justify-content: space-between;
  }

  .footer--split .footer__left {
    display: flex;
    gap: var(--size-xxsmall);
    align-items: center;
    flex: 1;
  }

  .footer--split .footer__right {
    display: flex;
    gap: var(--size-xxsmall);
    align-items: center;
    justify-content: end;
  }

  /* A kit Text at the footer's edge sits 16px in: a button's own padding
     insets its label, so buttons sit 8px in. */
  .footer--split .footer__left > :global(.text:first-child) {
    margin-left: var(--size-xxsmall);
  }

  .footer__right > :global(.text:last-child) {
    margin-right: var(--size-xxsmall);
  }

  .footer--full {
    display: flex;
    width: 100%;
  }

  .footer--full :global(> *) {
    flex: 1;
  }

  .footer--full :global(button) {
    flex: 1;
    width: 100%;
  }
</style>
