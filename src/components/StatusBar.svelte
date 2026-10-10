<script lang="ts">
  import { onDestroy } from "svelte";
  import { IconButton } from "figma-ui3-kit-svelte";
  import { IconClose } from "figma-ui3-kit-svelte/icons";

  // Status bar for notifications with auto-dismiss
  // Supports types: 'info', 'success', 'error', 'warning'
  // Auto-dismisses after 4s for 'info' and 'success' types

  interface Props {
    /** Message to display */
    message?: string;
    /** Status type */
    type?: "info" | "success" | "error" | "warning";
    class?: string;
    /** Dismissed, by its button or after 4s */
    onclose?: () => void;
  }

  let {
    message = "",
    type = "info",
    class: className = "",
    onclose,
  }: Props = $props();

  let visible = $state(false);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  let shouldAutoDismiss = $derived(type === "success" || type === "info");

  // Compute icon color based on type
  let computedIconColor = $derived(
    type === "error"
      ? "--figma-color-icon-ondanger"
      : type === "success"
        ? "--figma-color-icon-onsuccess"
        : type === "warning"
          ? "--figma-color-icon-onwarning"
          : "--figma-color-icon",
  );

  // Show status when message changes
  // The last message's timer goes first: an error that follows an info
  // message within 4s would otherwise close with it
  $effect.pre(() => {
    clearTimeout(timeoutId);
    if (message) {
      visible = true;
      if (shouldAutoDismiss) {
        timeoutId = setTimeout(() => handleClose(), 4000);
      }
    } else {
      visible = false;
    }
  });

  function handleClose() {
    visible = false;
    clearTimeout(timeoutId);
    onclose?.();
  }

  onDestroy(() => {
    clearTimeout(timeoutId);
  });
</script>

{#if visible && message}
  <div
    class="status-bar {className}"
    class:status-bar--error={type === "error"}
    class:status-bar--success={type === "success"}
    class:status-bar--warning={type === "warning"}
    role={type === "error" || type === "warning" ? "alert" : "status"}
  >
    <span>{message}</span>
    <IconButton
      iconName={IconClose}
      ariaLabel="Dismiss"
      onclick={handleClose}
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
    color: var(--figma-color-text);
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
