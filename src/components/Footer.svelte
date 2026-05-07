<script>
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
   *   <svelte:fragment slot="left">
   *     <Button variant="secondary">Cancel</Button>
   *   </svelte:fragment>
   *   <svelte:fragment slot="right">
   *     <Button variant="primary">Save</Button>
   *   </svelte:fragment>
   * </Footer>
   *
   * <!-- Full width buttons -->
   * <Footer variant="full">
   *   <Button variant="primary">Create item</Button>
   * </Footer>
   */

  /** Layout variant: 'right', 'split', 'full' */
  export let variant = "right";

  /** Additional CSS class */
  export let className = "";
</script>

<footer class="footer footer--{variant} {className}">
  {#if variant === "right"}
    <div class="footer__right">
      <slot />
    </div>
  {:else if variant === "split"}
    <div class="footer__left">
      <slot name="left" />
    </div>
    <div class="footer__right">
      <slot name="right" />
    </div>
  {:else if variant === "full"}
    <slot />
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
