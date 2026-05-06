<script>
  import { Text } from "figma-ui3-kit-svelte";

  /**
   * Loading state indicator
   * Displays a centered message while content is loading
   *
   * @example
   * {#if isLoading}
   *   <LoadingState message="Loading collections..." />
   * {:else}
   *   <MainContent />
   * {/if}
   */

  /** Message to display */
  export let message = "Loading...";

  let className = "";
  export { className as class };
</script>

<div class="loading-state {className}" role="status">
  <Text variant="body-medium" color="--figma-color-text-secondary">{message}</Text>
</div>

<style>
  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: var(--size-medium);
  }
</style>
