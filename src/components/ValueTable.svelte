<!--
  ValueTable: named rows with a value per column — a set's size or spacing
  at each breakpoint. A list of row buttons, not a table: each row is named
  by its `label`, with its values in it. Selecting a row opens the `editor`
  slot under it; removed rows are colored and can't be selected. A row's
  badges go in the `badges` slot, its trailing button in `action`.
-->
<script>
  import { createEventDispatcher } from "svelte";
  import { Badge, Text } from "figma-ui3-kit-svelte";

  /**
   * @typedef {{ label: string, title?: string }} Column
   * @typedef {{
   *   text: string | number,
   *   tone?: "new" | "changed" | "muted" | null,
   *   title?: string | null,
   * }} Cell
   * @typedef {{
   *   key: string,
   *   name: string,
   *   label: string,
   *   cells: Cell[],
   *   tone?: "new" | null,
   *   removed?: boolean,
   *   [extra: string]: any,
   * }} Row
   */

  /** @type {(Column | string)[]} The value columns, after the name. */
  export let columns = [];
  /** @type {Row[]} */
  export let rows = [];
  /** The name column's header. */
  export let nameLabel = "Name";
  /** @type {string | null} The row whose editor is open. */
  export let selectedKey = null;
  /** @type {number | null} A column to mark, header and cells. */
  export let active = null;
  /** Makes the column headers buttons that dispatch `column`. */
  export let selectableColumns = false;
  /** @type {{ label: string, variant: string }[]} What the colors mean. */
  export let legend = [];

  let className = "";
  export { className as class };

  const dispatch = createEventDispatcher();

  $: cols = columns.map((c) => (typeof c === "string" ? { label: c } : c));
</script>

<div class="table {className}" style="--cols: {cols.length}">
  <div class="row-wrap" aria-hidden={selectableColumns ? undefined : "true"}>
    <div class="tr th">
      <span aria-hidden="true">{nameLabel}</span>
      {#each cols as col, c (col.label)}
        {#if selectableColumns}
          <button
            type="button"
            class="num col"
            class:active={c === active}
            aria-label="Show {col.label}"
            aria-pressed={c === active}
            title={col.title ?? null}
            on:click={() => dispatch("column", c)}>{col.label}</button
          >
        {:else}
          <span
            class="num"
            class:active={c === active}
            title={col.title ?? null}>{col.label}</span
          >
        {/if}
      {/each}
    </div>
    <span></span>
  </div>
  {#each rows as row (row.key)}
    {@const selected = !row.removed && selectedKey === row.key}
    <div class="row-wrap" class:item={!row.removed} class:selected>
      {#if row.removed}
        <div class="tr removed" aria-label={row.label}>
          <span class="token">
            <span class="name">{row.name}</span>
            <slot name="badges" {row} />
          </span>
          {#each row.cells as cell, c (c)}
            <span class="num" title={cell.title ?? null}>{cell.text}</span>
          {/each}
        </div>
      {:else}
        <button
          type="button"
          class="tr row"
          aria-label={row.label}
          aria-expanded={selected}
          on:click={() => dispatch("select", row)}
        >
          <span class="token">
            <span class="name" class:is-new={row.tone === "new"}
              >{row.name}</span
            >
            <slot name="badges" {row} />
          </span>
          {#each row.cells as cell, c (c)}
            <span
              class="num"
              class:active={c === active}
              class:is-new={cell.tone === "new"}
              class:cell-changed={cell.tone === "changed"}
              class:muted={cell.tone === "muted"}
              title={cell.title ?? null}>{cell.text}</span
            >
          {/each}
        </button>
      {/if}
      <span class="action"><slot name="action" {row} /></span>
    </div>
    {#if selected}
      <slot name="editor" {row} />
    {/if}
  {/each}
</div>
<slot name="note" />
{#if legend.length}
  <div class="legend">
    {#each legend as item (item.label)}
      <span class="legend-item">
        <Badge dot variant={item.variant} />
        <Text variant="body-small" color="--figma-color-text-secondary"
          >{item.label}</Text
        >
      </span>
    {/each}
  </div>
{/if}

<style>
  .table {
    display: flex;
    flex-direction: column;
    font-size: 11px;
    font-family: var(--font-family-code, monospace);
  }
  .tr {
    display: grid;
    grid-template-columns: minmax(0, 1fr) repeat(var(--cols, 5), 2.75rem);
    gap: 4px;
    align-items: center;
    padding: var(--size-xxxsmall) var(--size-xxsmall);
    border: none;
    background: none;
    color: var(--figma-color-text);
    font: inherit;
    text-align: left;
  }
  /* A row and its action side by side; the button can't sit in the row,
     which is a button itself. */
  .row-wrap {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--size-small);
    column-gap: var(--size-xxxsmall);
    align-items: center;
    border-bottom: 1px solid var(--figma-color-border);
  }
  .action {
    display: flex;
  }
  /* Hover and selection as in a tree row, rounded and inset; the action
     sits outside it. */
  .row {
    width: 100%;
    border-radius: var(--border-radius-medium);
    cursor: pointer;
  }
  .row:hover {
    background: var(--figma-color-bg-hover);
  }
  .item.selected .row {
    background: var(--figma-color-bg-selected);
  }
  .item.selected .row:hover {
    background: var(--figma-color-bg-selected-hover);
  }
  .row:focus-visible,
  .col:focus-visible {
    outline: 1px solid var(--figma-color-border-selected);
    outline-offset: -1px;
  }
  .th {
    color: var(--figma-color-text-secondary);
  }
  .token {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /* Padded and rounded, so the marked column's highlight is a pill inside
     the row; the row keeps its height. */
  .num {
    padding: 3px var(--size-xxxsmall);
    border-radius: var(--border-radius-medium);
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .col {
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
  .col:hover:not(.active) {
    background: var(--figma-color-bg-hover);
  }
  .active {
    background: var(--figma-color-bg-selected-secondary);
  }
  .th .active {
    color: var(--figma-color-text);
  }
  /* On a selected row the column is a shade deeper than the row. */
  .item.selected .active {
    background: var(--figma-color-bg-selected-hover);
  }
  .is-new {
    color: var(--figma-color-text-success);
  }
  .cell-changed {
    color: var(--figma-color-text-warning);
    font-weight: 600;
  }
  .removed {
    color: var(--figma-color-text-danger);
  }
  .muted {
    color: var(--figma-color-text-secondary);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    column-gap: var(--size-xsmall);
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--size-xxxsmall);
  }
</style>
