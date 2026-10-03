/**
 * Variable helpers for plugin code (code.ts): alias and color guards, and a
 * variable's value through any aliases.
 */

/** Whether a variable value is an alias to another variable. */
export function isVariableAlias(value: unknown): value is VariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as VariableAlias).type === "VARIABLE_ALIAS"
  );
}

/** Whether a variable value is a color, RGB or RGBA with 0–1 channels. */
export function isColorValue(value: unknown): value is RGB | RGBA {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as RGB).r === "number" &&
    typeof (value as RGB).g === "number" &&
    typeof (value as RGB).b === "number"
  );
}

/** A color value as RGBA, alpha 1 where it has none, or null for anything else. */
export function toRgba(value: unknown): RGBA | null {
  return isColorValue(value) ? { a: 1, ...value } : null;
}

/** The file's local variables and collections by id, read once for many lookups. */
export interface VariableLookup {
  variables: Map<string, Variable>;
  collections: Map<string, VariableCollection>;
}

export async function getVariableLookup(): Promise<VariableLookup> {
  const [variables, collections] = await Promise.all([
    figma.variables.getLocalVariablesAsync(),
    figma.variables.getLocalVariableCollectionsAsync(),
  ]);
  return {
    variables: new Map(variables.map((v): [string, Variable] => [v.id, v])),
    collections: new Map(
      collections.map((c): [string, VariableCollection] => [c.id, c]),
    ),
  };
}

// A variable's value at a mode, or at its collection's default mode where it
// has none there (null asks for the default).
function valueAt(
  variable: Variable,
  modeId: string | null,
  collection: VariableCollection | null | undefined,
): VariableValue | undefined {
  return (
    (modeId !== null ? variable.valuesByMode[modeId] : undefined) ??
    (collection
      ? variable.valuesByMode[collection.defaultModeId]
      : undefined) ??
    Object.values(variable.valuesByMode)[0]
  );
}

// The mode to read an alias's target at: the same mode where its collection
// has it (an alias within one collection), else the default.
const modeIn = (
  modeId: string | null,
  collection: VariableCollection | null | undefined,
): string | null =>
  modeId !== null && collection?.modes.some((m) => m.modeId === modeId)
    ? modeId
    : null;

/**
 * A variable's value at a mode (null for its collection's default), following
 * aliases to a value that isn't one. Each variable down the chain is read at
 * the same mode where its collection has it, else at its default mode. Given
 * an alias, starts at its target. Local variables only, from `lookup`; null
 * where the chain leaves the file or runs past `maxDepth`.
 */
export function resolveVariableValue(
  start: Variable | VariableAlias,
  modeId: string | null,
  lookup: VariableLookup,
  maxDepth = 10,
): VariableValue | null {
  let variable: Variable | undefined;
  let mode = modeId;
  if (isVariableAlias(start)) {
    variable = lookup.variables.get(start.id);
    if (!variable) return null;
    mode = modeIn(mode, lookup.collections.get(variable.variableCollectionId));
  } else {
    variable = start;
  }
  for (let depth = 0; depth <= maxDepth; depth++) {
    const raw = valueAt(
      variable,
      mode,
      lookup.collections.get(variable.variableCollectionId),
    );
    if (!isVariableAlias(raw)) return raw ?? null;
    const target: Variable | undefined = lookup.variables.get(raw.id);
    if (!target) return null;
    mode = modeIn(mode, lookup.collections.get(target.variableCollectionId));
    variable = target;
  }
  return null;
}

/**
 * As `resolveVariableValue`, but follows aliases into enabled libraries too,
 * fetching any variable or collection `lookup` doesn't have (or every one,
 * without a lookup).
 */
export async function resolveVariableValueAsync(
  start: Variable | VariableAlias,
  modeId: string | null,
  lookup?: VariableLookup,
  maxDepth = 10,
): Promise<VariableValue | null> {
  const variableById = async (id: string) =>
    lookup?.variables.get(id) ??
    (await figma.variables.getVariableByIdAsync(id));
  const collectionOf = async (v: Variable) =>
    lookup?.collections.get(v.variableCollectionId) ??
    (await figma.variables.getVariableCollectionByIdAsync(
      v.variableCollectionId,
    ));

  let variable: Variable | null;
  let mode = modeId;
  if (isVariableAlias(start)) {
    variable = await variableById(start.id);
    if (!variable) return null;
    mode = modeIn(mode, await collectionOf(variable));
  } else {
    variable = start;
  }
  for (let depth = 0; depth <= maxDepth; depth++) {
    const raw = valueAt(variable, mode, await collectionOf(variable));
    if (!isVariableAlias(raw)) return raw ?? null;
    const target: Variable | null = await variableById(raw.id);
    if (!target) return null;
    mode = modeIn(mode, await collectionOf(target));
    variable = target;
  }
  return null;
}
