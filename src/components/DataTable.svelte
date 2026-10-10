<!--
  DataTable: named rows with a cell per column, laid out as a table — a
  set's size at each breakpoint, or a style's size and line height before
  and after an update. The name leads each row, with its notes as badges
  after it: the first `maxBadges`, and a count of the rest listed in its
  title. A cell is a badge, a variable chip where it aliases a variable, or
  plain text; badges and text are colored as new, changed or danger.

  Selectable (the default), rows are buttons, named by their `label`, that
  open the `editor` snippet under them, with a trailing button in `action`.
  Not selectable, the table is read-only, with table roles. Removed rows are
  colored and can't be selected either way.
-->
<script lang="ts" module>
  /** `width` is a grid track, 2.75rem by default; `align` "start" by default, "end" to right-align numbers. */
  export interface Column {
    label: string;
    title?: string;
    width?: string;
    align?: "start" | "end";
  }

  /** `alias` names the variable the value aliases, shown as a chip; `plain`
   * shows the text as it is, not as a badge (muted cells are). */
  export interface Cell {
    text: string | number;
    tone?: "new" | "changed" | "danger" | "muted" | null;
    title?: string | null;
    alias?: string | null;
    plain?: boolean;
  }

  export interface Row {
    key: string;
    name: string;
    label?: string;
    cells: Cell[];
    tone?: "new" | null;
    removed?: boolean;
    badges?: { text: string; variant?: string; title?: string }[];
    /** Whatever else the caller keeps on a row, for its snippets and `onselect` */
    [extra: string]: any;
  }
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import { Badge, Tooltip, VariablePill } from "figma-ui3-kit-svelte";

  interface Props {
    /** The columns after the name. */
    columns?: (Column | string)[];
    rows?: Row[];
    /** The name column's header. */
    nameLabel?: string;
    /** Rows are buttons that open an editor; false makes the table read-only. */
    selectable?: boolean;
    /** The row whose editor is open. */
    selectedKey?: string | null;
    /** A column to mark, header and cells. */
    active?: number | null;
    /** Makes the column headers buttons that call `oncolumn`. */
    selectableColumns?: boolean;
    /**
     * The container's side padding, such as "var(--size-xsmall)": the rows
     * run through it to the container's edges, their contents still in line
     * with the rest of it.
     */
    inset?: string | null;
    /** How many of a row's badges show before the rest become a count. */
    maxBadges?: number;
    /** Names a read-only table. */
    ariaLabel?: string | null;
    class?: string;
    /** A trailing button on each row */
    action?: Snippet<[Row]>;
    /** Under the selected row */
    editor?: Snippet<[Row]>;
    /** Under the table */
    note?: Snippet;
    /** A row, when selectable */
    onselect?: (row: Row) => void;
    /** A column header, when `selectableColumns`: its index */
    oncolumn?: (index: number) => void;
  }

  let {
    columns = [],
    rows = [],
    nameLabel = "Name",
    selectable = true,
    selectedKey = null,
    active = null,
    selectableColumns = false,
    inset = null,
    maxBadges = 2,
    ariaLabel = null,
    class: className = "",
    action,
    editor,
    note,
    onselect,
    oncolumn,
  }: Props = $props();

  // The badge a value gets for its tone.
  const TONES: Record<string, string> = {
    new: "success",
    changed: "warning",
    danger: "danger",
  };

  const shown = (row: Row, max: number) => (row.badges ?? []).slice(0, max);
  const hidden = (row: Row, max: number) => (row.badges ?? []).slice(max);

  let cols = $derived(
    columns.map((c) => (typeof c === "string" ? { label: c } : c)) as Column[],
  );
  let tracks = $derived(cols.map((c) => c.width ?? "2.75rem").join(" "));
  // Read-only, the table has table roles; selectable, its rows are buttons
  // named by their label, and the header is for sight only unless it picks.
  let roles = $derived(!selectable);
  let headerHidden = $derived(!roles && !selectableColumns);
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
            onclick={() => oncolumn?.(c)}>{col.label}</button
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
        onclick={() => interactive && onselect?.(row)}
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
                  : (TONES[cell.tone ?? ""] ?? "default")}
                text={String(cell.text)}
              />
            {/if}
          </span>
        {/each}
      </svelte:element>
      <span class="action">{@render action?.(row)}</span>
    </div>
    {#if selected}
      <div class="editor">{@render editor?.(row)}</div>
    {/if}
  {/each}
</div>
{@render note?.()}

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
