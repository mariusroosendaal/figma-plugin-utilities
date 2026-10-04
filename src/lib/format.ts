/**
 * Copy helpers with no Figma API, for either thread.
 */

/** "1 layer", "3 layers"; `pluralForm` for the irregular ones: "2 entries" */
export const plural = (
  count: number,
  singular: string,
  pluralForm = `${singular}s`,
): string => `${count} ${count === 1 ? singular : pluralForm}`;

/** "a", "a and b", "a, b and c"; `conjunction` replaces "and" */
export const joinList = (items: string[], conjunction = "and"): string =>
  items.length <= 1
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
