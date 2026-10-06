<!--
  DataTable: named rows with a cell per column, laid out as a table — a
  set's size at each breakpoint, or a style's size and line height before
  and after an update. The name leads each row, with its notes as badges
  after it: the first `maxBadges`, and a count of the rest listed in its
  title. A cell is a badge, a variable chip where it aliases a variable, or
  plain text; badges and text are colored as new, changed or danger.

  Selectable (the default), rows are buttons, named by their `label`, that
  open the `editor` slot under them, with a trailing button in `action`.
  Not selectable, the table is read-only, with table roles. Removed rows are
  colored and can't be selected either way.
-->
<script>
  import { createEventDispatcher } from "svelte";
  import { Badge, Tooltip, VariablePill } from "figma-ui3-kit-svelte";

  /**
   * @typedef {{
   *   label: string,
   *   title?: string,
   *   width?: string,
   *   align?: "start" | "end",
   * }} Column  `width` is a grid track, 2.75rem by default; `align` "start"
   *   by default, "end" to right-align numbers.
   * @typedef {{
   *   text: string | number,
   *   tone?: "new" | "changed" | "danger" | "muted" | null,
   *   title?: string | null,
   *   alias?: string | null,
   *   plain?: boolean,
   * }} Cell  `alias` names the variable the value aliases, shown as a chip;
   *   `plain` shows the text as it is, not as a badge (muted cells are).
   * @typedef {{
   *   key: string,
   *   name: string,
   *   label?: string,
   *   cells: Cell[],
   *   tone?: "new" | null,
   *   removed?: boolean,
   *   badges?: { text: string, variant?: string, title?: string }[],
   *   [extra: string]: any,
   * }} Row
   */

  /** @type {(Column | string)[]} The columns after the name. */
  export let columns = [];
  /** @type {Row[]} */
  export let rows = [];
  /** The name column's header. */
  export let nameLabel = "Name";
  /** Rows are buttons that open an editor; false makes the table read-only. */
  export let selectable = true;
  /** @type {string | null} The row whose editor is open. */
  export let selectedKey = null;
  /** @type {number | null} A column to mark, header and cells. */
  export let active = null;
  /** Makes the column headers buttons that dispatch `column`. */
  export let selectableColumns = false;
  /**
   * @type {string | null} The container's side padding, such as
   * "var(--size-xsmall)": the rows run through it to the container's edges,
   * their contents still in line with the rest of it.
   */
  export let inset = null;
  /** How many of a row's badges show before the rest become a count. */
  export let maxBadges = 2;
  /** @type {string | null} Names a read-only table. */
  export let ariaLabel = null;

  let className = "";
  export { className as class };

  const dispatch = createEventDispatcher();

  // The badge a value gets for its tone.
  const TONES = { new: "success", changed: "warning", danger: "danger" };

  // The limit is passed in, so the markup re-runs when it changes.
  const shown = (row, max) => (row.badges ?? []).slice(0, max);
  const hidden = (row, max) => (row.badges ?? []).slice(max);

  $: cols = columns.map((c) => (typeof c === "string" ? { label: c } : c));
  $: tracks = cols.map((c) => c.width ?? "2.75rem").join(" ");
  // Read-only, the table has table roles; selectable, its rows are buttons
  // named by their label, and the header is for sight only unless it picks.
  $: roles = !selectable;
  $: headerHidden = !roles && !selectableColumns;
</script>

<div
  class="table {className}"
  class:static={!selectable}
  style:--tracks={tracks}
  style:--inset={inset}
  role={roles ? "table" : undefined}
  aria-label={roles ? ariaLabel : undefined}
>
  <div class="row-wrap" aria-hidden={headerHidden ? "true" : undefined}>
    <div class="tr th" role={roles ? "row" : undefined}>
      <span
        role={roles ? "columnheader" : undefined}
        aria-hidden={roles ? undefined : "true"}>{nameLabel}</span
      >
      {#each cols as col, c (col.label)}
        {#if selectableColumns}
          <button
            type="button"
            class="num col"
            class:end={col.align === "end"}
            class:active={c === active}
            aria-label="Show {col.label}"
            aria-pressed={c === active}
            title={col.title ?? null}
            on:click={() => dispatch("column", c)}>{col.label}</button
          >
        {:else}
          <span
            class="num"
            class:end={col.align === "end"}
            class:active={c === active}
            role={roles ? "columnheader" : undefined}
            title={col.title ?? null}>{col.label}</span
          >
        {/if}
      {/each}
    </div>
    <span></span>
  </div>
  {#each rows as row (row.key)}
    {@const interactive = selectable && !row.removed}
    {@const selected = interactive && selectedKey === row.key}
    <div class="row-wrap" class:item={interactive} class:selected>
      <svelte:element
        this={interactive ? "button" : "div"}
        type={interactive ? "button" : undefined}
        class="tr"
        class:row={interactive}
        class:removed={row.removed}
        role={roles ? "row" : undefined}
        aria-label={roles ? undefined : row.label}
        aria-expanded={interactive ? selected : undefined}
        on:click={() => interactive && dispatch("select", row)}
      >
        <span class="token" role={roles ? "cell" : undefined}>
          <span class="name" class:is-new={row.tone === "new"}>{row.name}</span>
          <!-- Tooltips, not titles: a plugin's frame may not show a title. -->
          {#each shown(row, maxBadges) as badge, i (i)}
            {#if badge.title}
              <Tooltip label={badge.title} direction="Top">
                <Badge variant={badge.variant ?? "default"} text={badge.text} />
              </Tooltip>
            {:else}
              <Badge variant={badge.variant ?? "default"} text={badge.text} />
            {/if}
          {/each}
          {#if hidden(row, maxBadges).length}
            <Tooltip
              label={hidden(row, maxBadges)
                .map((b) => b.text)
                .join(", ")}
              direction="Top"
            >
              <Badge text="+{hidden(row, maxBadges).length}" />
            </Tooltip>
          {/if}
        </span>
        {#each row.cells as cell, c (c)}
          {@const plain = cell.plain || cell.tone === "muted"}
          <span
            class="num"
            class:end={cols[c]?.align === "end"}
            class:active={c === active}
            class:plain
            class:muted={cell.tone === "muted"}
            class:text-new={plain && cell.tone === "new"}
            class:text-changed={plain && cell.tone === "changed"}
            class:text-danger={plain && cell.tone === "danger"}
            role={roles ? "cell" : undefined}
            title={[cell.alias, cell.title].filter(Boolean).join(", ") || null}
          >
            {#if plain}
              {cell.text}
            {:else if cell.alias && !row.removed}
              <!-- No label, so no title of its own over the cell's. -->
              <VariablePill
                label={null}
                class={cell.tone ? `tone-${cell.tone}` : ""}
                >{cell.text}</VariablePill
              >
            {:else}
              <Badge
                variant={row.removed
                  ? "danger"
                  : (TONES[cell.tone] ?? "default")}
                text={String(cell.text)}
              />
            {/if}
          </span>
        {/each}
      </svelte:element>
      <span class="action"><slot name="action" {row} /></span>
    </div>
    {#if selected}
      <div class="editor"><slot name="editor" {row} /></div>
    {/if}
  {/each}
</div>
<slot name="note" />

<style>
  /* Run through the container's padding. Rows keep their own 8px inside,
     so the name lines up with the container's content; the action ends 8px
     from the edge, in line with a Header's icons. */
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
    grid-template-columns: minmax(0, 1fr) var(--tracks,);
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
  /* 32px rows, header included, their rule counted in. */
  .row-wrap {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--size-small);
    column-gap: var(--size-xxxsmall);
    align-items: center;
    min-height: var(--size-medium);
    padding-inline: max(0px, calc(var(--inset, 0px) - var(--size-xxsmall)));
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
  /* Body medium strong, as Text's body-medium-strong; the table already
     sets the body medium size, line height and letter spacing. */
  .th {
    color: var(--figma-color-text);
    font-weight: var(--font-weight-strong);
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
    text-align: left;
  }
  /* Tabular figures line up plain numbers in a column; a badge or chip is
     sized to its own text, where they'd only widen a narrow 1. */
  .num.plain {
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
  .text-new {
    color: var(--figma-color-text-success);
  }
  .text-changed {
    color: var(--figma-color-text-warning);
  }
  .text-danger {
    color: var(--figma-color-text-danger);
  }
  /* Columns set to end, for numbers, read from the right. */
  .num.end {
    text-align: right;
  }
  /* Read-only rows have no action; the name runs to the edge. */
  .static .row-wrap {
    grid-template-columns: minmax(0, 1fr);
  }
  .static .action {
    display: none;
  }
</style>
