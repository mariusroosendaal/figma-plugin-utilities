<script>
  /**
   * Standard plugin layout wrapper
   * Provides consistent structure with main content area and optional footer
   *
   * @example
   * <PluginLayout>
   *   <p>Main content here</p>
   *   <svelte:fragment slot="footer">
   *     <Button variant="primary">Create item</Button>
   *   </svelte:fragment>
   * </PluginLayout>
   */

  /** Additional CSS classes for the wrapper */
  export let className = "";
</script>

<div class="plugin-wrapper {className}">
  <main class="plugin-main">
    <slot />
  </main>
</div>

<style>
  .plugin-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: var(--figma-color-text);
    font-family: var(--figma-font-stack);
    overflow: hidden;
  }

  .plugin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--size-xsmall);
    overflow-y: auto;
    padding: var(--size-xsmall);
  }
</style>
