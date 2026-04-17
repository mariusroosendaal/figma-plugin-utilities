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
</script>

<div class="loading-state">
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
