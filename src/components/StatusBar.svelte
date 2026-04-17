<script>
  import { onDestroy, createEventDispatcher } from "svelte";
  import { IconButton, IconClose } from "figma-ui3-kit-svelte";

  // Status bar for notifications with auto-dismiss
  // Supports types: 'info', 'success', 'error', 'warning'
  // Auto-dismisses after 4s for 'info' and 'success' types

  const dispatch = createEventDispatcher();

  /** Message to display */
  export let message = "";

  /** Status type: 'info', 'success', 'error', 'warning' */
  export let type = "info";

  let visible = false;
  let timeoutId;

  $: shouldAutoDismiss = type === "success" || type === "info";

  // Compute icon color based on type
  $: computedIconColor =
    type === "error"
      ? "--figma-color-icon-ondanger"
      : type === "success"
        ? "--figma-color-icon-onsuccess"
        : type === "warning"
          ? "--figma-color-icon-onwarning"
          : "--figma-color-icon";

  // Show status when message changes
  $: if (message) {
    visible = true;
    if (shouldAutoDismiss) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleClose(), 4000);
    }
  } else {
    visible = false;
  }

  function handleClose() {
    visible = false;
    clearTimeout(timeoutId);
    dispatch("close");
  }

  onDestroy(() => {
    clearTimeout(timeoutId);
  });
</script>

{#if visible && message}
  <div
    class="status-bar"
    class:status-bar--error={type === "error"}
    class:status-bar--success={type === "success"}
    class:status-bar--warning={type === "warning"}
  >
    <span>{message}</span>
    <IconButton
      iconName={IconClose}
      on:click={handleClose}
      iconColor={computedIconColor}
    />
  </div>
{/if}

<style>
  .status-bar {
    position: relative;
    height: var(--size-large);
    padding: 0 var(--size-xxsmall) 0 var(--size-xsmall);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--figma-color-bg-secondary);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    overflow: hidden;
  }

  .status-bar > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-bar--error {
    background: var(--figma-color-bg-danger);
    color: var(--figma-color-text-ondanger);
  }

  .status-bar--success {
    background: var(--figma-color-bg-success);
    color: var(--figma-color-text-onsuccess);
  }

  .status-bar--warning {
    background: var(--figma-color-bg-warning);
    color: var(--figma-color-text-onwarning);
  }
</style>
