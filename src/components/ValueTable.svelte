<!--
  ValueTable: named rows with a value per column — a set's size or spacing
  at each breakpoint. A list of row buttons, not a table: each row is named
  by its `label`, with its values in it. Selecting a row opens the `editor`
  slot under it; removed rows are colored and can't be selected. A value
  that aliases a variable is its chip; others are badges. Both are colored
  as new, changed or removed; muted values are plain text. A row's notes
  are badges after its name, the first `maxBadges` of them and a count of
  the rest, listed in its title; its trailing button goes in `action`.
-->
<script>
  import { createEventDispatcher } from "svelte";
  import { Badge, Text, VariablePill } from "figma-ui3-kit-svelte";

  /**
   * @typedef {{ label: string, title?: string }} Column
   * @typedef {{
   *   text: string | number,
   *   tone?: "new" | "changed" | "muted" | null,
   *   title?: string | null,
   *   alias?: string | null,
   * }} Cell  `alias` names the variable the value aliases, shown as a chip.
   * @typedef {{
   *   key: string,
   *   name: string,
   *   label: string,
   *   cells: Cell[],
   *   tone?: "new" | null,
   *   removed?: boolean,
   *   badges?: { text: string, variant?: string }[],
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
  /**
   * @type {string | null} The container's side padding, such as
   * "var(--size-xsmall)": the rows run through it to the container's edges,
   * their contents still in line with the rest of it.
   */
  export let inset = null;
  /** How many of a row's badges show before the rest become a count. */
  export let maxBadges = 2;

  let className = "";
  export { className as class };

  const dispatch = createEventDispatcher();

  // The badge a value gets for its tone.
  const TONES = { new: "success", changed: "warning" };

  // Reactive, so the rows follow a new limit.
  $: shown = (row) => (row.badges ?? []).slice(0, maxBadges);
  $: hidden = (row) => (row.badges ?? []).slice(maxBadges);

  $: cols = columns.map((c) => (typeof c === "string" ? { label: c } : c));
</script>

<div class="table {className}" style:--cols={cols.length} style:--inset={inset}>
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
            {#each shown(row) as badge, i (i)}
              <Badge variant={badge.variant ?? "default"} text={badge.text} />
            {/each}
            {#if hidden(row).length}
              <span
                title={hidden(row)
                  .map((b) => b.text)
                  .join(", ")}
              >
                <Badge text="+{hidden(row).length}" />
              </span>
            {/if}
          </span>
          {#each row.cells as cell, c (c)}
            <span class="num" title={cell.title ?? null}>
              {#if cell.tone === "muted"}
                {cell.text}
              {:else}
                <Badge variant="danger" text={String(cell.text)} />
              {/if}
            </span>
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
            {#each shown(row) as badge, i (i)}
              <Badge variant={badge.variant ?? "default"} text={badge.text} />
            {/each}
            {#if hidden(row).length}
              <span
                title={hidden(row)
                  .map((b) => b.text)
                  .join(", ")}
              >
                <Badge text="+{hidden(row).length}" />
              </span>
            {/if}
          </span>
          {#each row.cells as cell, c (c)}
            <span
              class="num"
              class:active={c === active}
              class:muted={cell.tone === "muted"}
              title={[cell.alias, cell.title].filter(Boolean).join(", ") ||
                null}
            >
              {#if cell.tone === "muted"}
                {cell.text}
              {:else if cell.alias}
                <!-- No label, so no title of its own over the cell's. -->
                <VariablePill
                  label={null}
                  class={cell.tone ? `tone-${cell.tone}` : ""}
                  >{cell.text}</VariablePill
                >
              {:else}
                <Badge
                  variant={TONES[cell.tone] ?? "default"}
                  text={String(cell.text)}
                />
              {/if}
            </span>
          {/each}
        </button>
      {/if}
      <span class="action"><slot name="action" {row} /></span>
    </div>
    {#if selected}
      <div class="editor"><slot name="editor" {row} /></div>
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
  /* Run through the container's padding. Rows keep their own 8px inside,
     so the name lines up with the container's content; the action ends at
     its edge. */
  .table {
    display: flex;
    flex-direction: column;
    margin-inline: calc(-1 * var(--inset, 0px));
    font-family: var(--font-stack);
    font-size: var(--body-medium-font-size);
    font-weight: var(--body-medium-font-weight);
    line-height: var(--body-medium-line-height);
    letter-spacing: var(--body-medium-letter-spacing);
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
    letter-spacing: inherit;
    text-align: left;
  }
  /* A row and its action side by side; the button can't sit in the row,
     which is a button itself. */
  .row-wrap {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--size-small);
    column-gap: var(--size-xxxsmall);
    align-items: center;
    padding-inline: max(0px, calc(var(--inset, 0px) - var(--size-xxsmall)))
      var(--inset, 0px);
    border-bottom: 1px solid var(--figma-color-border);
  }
  .editor {
    padding-inline: max(0px, calc(var(--inset, 0px) - var(--size-xxsmall)));
    border-bottom: 1px solid var(--figma-color-border);
  }
  .action {
    display: flex;
  }
  /* Hover and the open row share one gray, the action included. */
  .row {
    width: 100%;
    cursor: pointer;
  }
  .item:hover,
  .item.selected {
    background: var(--figma-color-bg-secondary);
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
    letter-spacing: inherit;
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
  .is-new {
    color: var(--figma-color-text-success);
  }
  .removed {
    color: var(--figma-color-text-danger);
  }
  /* A chip has no colored variants; its text takes the badge's color. */
  .num :global(.variable-pill.tone-new) {
    color: var(--figma-color-text-success);
  }
  .num :global(.variable-pill.tone-changed) {
    color: var(--figma-color-text-warning);
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
