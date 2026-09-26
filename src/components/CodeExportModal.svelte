<!--
  Read-only code in a modal, with a button that copies it. Each modal keeps
  its own "Copied" state, so copying one never marks the other.
-->
<script>
  import { onDestroy } from "svelte";
  import { Button, Modal, Textarea } from "figma-ui3-kit-svelte";

  export let isOpen = false;
  export let title;
  export let value = "";
  /** Names the code for assistive tech, e.g. "Exported token JSON". */
  export let ariaLabel;
  /** The copy button's label, e.g. "Copy JSON". */
  export let copyLabel;
  export let position = "bottom";
  export let width = "medium";
  export let height = "auto";
  export let onClose = null;

  let copied = false;
  let copyTimer = null;
  onDestroy(() => clearTimeout(copyTimer));

  // Reopened, the button reads as it would before a copy.
  $: if (isOpen) copied = false;

  // execCommand, not the Clipboard API: the plugin iframe isn't granted
  // clipboard-write.
  function handleCopy() {
    try {
      const prevActive = document.activeElement;
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.left = "-999999px";
      ta.style.top = "-999999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      if (prevActive instanceof HTMLElement) prevActive.focus();
      if (ok) {
        copied = true;
        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => (copied = false), 2000);
      }
    } catch {
      // execCommand unavailable — nothing to do.
    }
  }
</script>

<Modal
  {isOpen}
  {title}
  {position}
  {width}
  {height}
  overlayPadding="0px"
  {onClose}
>
  <div class="export-content">
    <!-- Options for what's exported, above the code. -->
    <slot name="controls" />
    <Textarea {value} readonly {ariaLabel} variant="code" />
  </div>
  <svelte:fragment slot="footer-right">
    <Button variant="primary" on:click={handleCopy}>
      {copied ? "Copied" : copyLabel}
    </Button>
  </svelte:fragment>
</Modal>

<style>
  .export-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--size-xsmall);
    min-height: 0;
  }

  .export-content :global(.textarea) {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .export-content :global(textarea) {
    flex: 1;
    min-height: 0;
    resize: none;
    white-space: pre;
  }
</style>
