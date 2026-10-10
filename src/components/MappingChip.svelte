<!--
  MappingChip: one side of a source → target row, as a filled 24px chip with no
  border — Data Mapper's MappingButton, the Vitrine audit plugin's source and
  Icon Swapper's source icon. It is a button: clicking it usually selects or
  opens what it names.

  A lead icon or chit hangs into the padding, as the kit's Dropdown does with
  its own, so chips with and without one start their text a lead's width apart
  rather than a lead plus the padding. The label truncates; `preview` follows
  it after a dot, and `count` sits at the chip's end.
-->
<script lang="ts">
  import type { Snippet } from "svelte";
  import { Chit, Icon } from "figma-ui3-kit-svelte";

  interface Props {
    /** The chip's text */
    label?: string;
    /** Secondary text after the label, as "label · preview" */
    preview?: string;
    /** A trailing count, such as how many layers the chip stands for */
    count?: number | string | null;
    /** A lead icon, from `figma-ui3-kit-svelte/icons` */
    iconName?: string | null;
    /** A lead chit, the kit Chit's `color`; wins over `iconName` */
    chit?: string | string[] | null;
    /** Text and icon color: `component` for instances, `secondary` for a quieter side */
    tone?: "default" | "secondary" | "component";
    /** Marks the chip as the chosen one, with the selection border */
    selected?: boolean;
    disabled?: boolean;
    title?: string;
    ariaLabel?: string;
    /** The button, for anchoring a menu or popover to it */
    element?: HTMLButtonElement | null;
    class?: string;
    /** Ahead of the lead, for a marker such as a refused write's "!" */
    lead?: Snippet;
    /** Not while disabled */
    onclick?: (event: MouseEvent) => void;
  }

  let {
    label = "",
    preview = "",
    count = null,
    iconName = null,
    chit = null,
    tone = "default",
    selected = false,
    disabled = false,
    title = undefined,
    ariaLabel = undefined,
    element = $bindable(),
    class: className = "",
    lead,
    onclick,
  }: Props = $props();

  function iconColorFor(tone: string, disabled: boolean) {
    if (disabled) return "--figma-color-icon-disabled";
    if (tone === "component") return "--figma-color-icon-component";
    if (tone === "secondary") return "--figma-color-icon-secondary";
    return "--figma-color-icon";
  }
  let iconColor = $derived(iconColorFor(tone, disabled));

  function handleClick(event: MouseEvent) {
    if (!disabled) onclick?.(event);
  }
</script>

<button
  bind:this={element}
  class="mapping-chip {tone} {className}"
  class:selected
  {disabled}
  {title}
  aria-label={ariaLabel}
  onclick={handleClick}
>
  <!-- Ahead of the lead, for a marker such as a refused write's "!". -->
  {@render lead?.()}
  {#if chit}
    <span class="lead"><Chit color={chit} /></span>
  {:else if iconName}
    <span class="lead"><Icon {iconName} color={iconColor} /></span>
  {/if}
  <span class="text">
    {label}{#if preview}<span class="preview"> · {preview}</span>{/if}
  </span>
  {#if count !== null && count !== ""}
    <span class="count">{count}</span>
  {/if}
</button>

<style>
  .mapping-chip {
    appearance: none;
    display: flex;
    align-items: center;
    gap: var(--size-xxxsmall);
    height: var(--size-small);
    min-width: 0;
    padding: 0 var(--size-xxsmall);
    border: 0;
    border-radius: var(--border-radius-medium);
    background: var(--figma-color-bg-secondary);
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    letter-spacing: var(--body-medium-letter-spacing);
    line-height: var(--body-medium-line-height);
    color: var(--figma-color-text);
    text-align: left;
    cursor: pointer;
    user-select: none;
  }
  .mapping-chip.secondary {
    color: var(--figma-color-text-secondary);
  }
  .mapping-chip.component {
    color: var(--figma-color-text-component);
  }
  .mapping-chip:hover:not(:disabled) {
    background: var(--figma-color-bg-tertiary);
  }
  .mapping-chip:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }
  .mapping-chip.selected {
    box-shadow: inset 0 0 0 1px var(--figma-color-border-selected);
  }
  .mapping-chip:disabled {
    color: var(--figma-color-text-disabled);
    cursor: not-allowed;
  }
  /* The lead's 24px cell already carries the inset its glyph needs, so it
     hangs into the padding, and the text follows it without a gap. */
  .lead {
    display: flex;
    flex: 0 0 auto;
    margin-left: calc(-1 * var(--size-xxsmall));
    margin-right: calc(-1 * var(--size-xxxsmall));
  }
  .text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .preview {
    color: var(--figma-color-text-secondary);
  }
  .count {
    flex: 0 0 auto;
    color: var(--figma-color-text-tertiary);
    font-variant-numeric: tabular-nums;
  }
</style>
