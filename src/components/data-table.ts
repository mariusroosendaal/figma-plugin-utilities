// DataTable's columns, cells and rows, in a module of their own so plain
// `tsc` reads them too.

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [extra: string]: any;
}
