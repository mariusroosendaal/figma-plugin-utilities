<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * Standard plugin layout wrapper
   * Provides consistent structure with main content area and optional footer
   *
   * @example
   * <PluginLayout>
   *   <p>Main content here</p>
   *   <Button variant="primary">Create item</Button>
   * </PluginLayout>
   */

  interface Props {
    /** Additional CSS classes for the wrapper */
    class?: string;
    children?: Snippet;
  }

  let { class: className = "", children }: Props = $props();
</script>

<div class="plugin-wrapper {className}">
  <main class="plugin-main">
    {@render children?.()}
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

  .plugin-footer {
    flex-shrink: 0;
  }
</style>
