<!--
  Read-only code in a modal, with a button that copies it. Each modal keeps
  its own "Copied" state, so copying one never marks the other.
-->
<script lang="ts">
  import { onDestroy, type Snippet } from "svelte";
  import { Button, Modal, Textarea } from "figma-ui3-kit-svelte";

  interface Props {
    isOpen?: boolean;
    title: string;
    value?: string;
    /** Names the code for assistive tech, e.g. "Exported token JSON". */
    ariaLabel: string;
    /** The copy button's label, e.g. "Copy JSON". */
    copyLabel: string;
    position?: "center" | "left" | "right" | "bottom";
    width?: string | number;
    height?: string | number;
    /** Options for what's exported, above the code */
    controls?: Snippet;
    /** X, Escape or a click outside */
    onclose?: () => void;
  }

  let {
    isOpen = $bindable(),
    title,
    value = "",
    ariaLabel,
    copyLabel,
    position = "bottom",
    width = "medium",
    height = "auto",
    controls,
    onclose,
  }: Props = $props();

  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | undefined;
  onDestroy(() => clearTimeout(copyTimer));

  // Reopened, the button reads as it would before a copy.
  $effect.pre(() => {
    if (isOpen) copied = false;
  });

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
  bind:isOpen
  {title}
  {position}
  {width}
  {height}
  overlayPadding="0px"
  {onclose}
>
  <div class="export-content">
    <!-- Options for what's exported, above the code. -->
    {@render controls?.()}
    <Textarea {value} readonly {ariaLabel} variant="code" />
  </div>
  {#snippet footerRight()}
    <Button variant="primary" onclick={handleCopy}>
      {copied ? "Copied" : copyLabel}
    </Button>
  {/snippet}
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
