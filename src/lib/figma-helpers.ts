/**
 * Figma API helpers for plugin code (code.ts)
 */

/**
 * Send a typed message to the UI
 * @param type - Message type identifier
 * @param data - Additional data to send
 */
export function sendToUI<T extends Record<string, unknown>>(
  type: string,
  data?: T,
): void {
  if (data) {
    figma.ui.postMessage({ type, ...data });
  } else {
    figma.ui.postMessage({ type });
  }
}

/**
 * Get all local variable collections
 * @returns Promise resolving to array of variable collections
 */
export async function getCollections(): Promise<VariableCollection[]> {
  return figma.variables.getLocalVariableCollectionsAsync();
}

/**
 * Get all local variables of a specific type
 * @param type - Variable type to filter by
 * @returns Promise resolving to array of variables
 */
export async function getVariables(
  type?: VariableResolvedDataType,
): Promise<Variable[]> {
  return figma.variables.getLocalVariablesAsync(type);
}

/**
 * Show an error notification to the user
 * @param message - Error message to display
 * @param timeout - How long to show the notification (ms)
 */
export function showError(message: string, timeout = 5000): void {
  figma.notify(message, { error: true, timeout });
}

/**
 * Show a success notification to the user
 * @param message - Success message to display
 * @param timeout - How long to show the notification (ms)
 */
export function showSuccess(message: string, timeout = 3000): void {
  figma.notify(message, { timeout });
}

/**
 * Get the current selection, optionally filtered by type
 * @param nodeType - Optional node type to filter by
 * @returns Array of selected nodes
 */
export function getSelection<T extends SceneNode>(
  nodeType?: NodeType,
): readonly T[] {
  const selection = figma.currentPage.selection;
  if (nodeType) {
    return selection.filter((node) => node.type === nodeType) as T[];
  }
  return selection as readonly T[];
}

/**
 * Focus the viewport on specific nodes
 * @param nodes - Nodes to focus on
 */
export function focusNodes(nodes: readonly SceneNode[]): void {
  if (nodes.length > 0) {
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
}

/**
 * Load a font before using it
 * @param family - Font family name
 * @param style - Font style (e.g., "Regular", "Bold")
 */
export async function loadFont(family: string, style: string): Promise<void> {
  await figma.loadFontAsync({ family, style });
}

/**
 * Every font a text node uses: its own when uniform, each run's when mixed.
 */
export function fontsOf(node: TextNode): FontName[] {
  if (node.fontName !== figma.mixed) return [node.fontName];
  return node.characters.length > 0
    ? node.getRangeAllFontNames(0, node.characters.length)
    : [];
}

const fontLoads = new Map<string, Promise<void>>();

/**
 * Load a font once per plugin run: later calls for it share the first load,
 * so hundreds of text layers wait once per font rather than a round trip
 * each. A load that fails is forgotten, so the next call tries again.
 */
export function loadFontOnce(font: FontName): Promise<void> {
  const key = `${font.family}\u0000${font.style}`;
  let load = fontLoads.get(key);
  if (!load) {
    load = figma.loadFontAsync(font).catch((error: unknown) => {
      fontLoads.delete(key);
      throw error;
    });
    fontLoads.set(key, load);
  }
  return load;
}

/**
 * Load every font a text node uses, each once per run — Figma refuses to
 * write to text whose fonts aren't loaded. Rejects when one won't load, as a
 * missing font doesn't.
 */
export async function loadNodeFonts(node: TextNode): Promise<void> {
  await Promise.all(fontsOf(node).map(loadFontOnce));
}

/**
 * Set a text node's characters in its own fonts, loading them first. Rejects,
 * leaving the text as it was, when one of its fonts won't load.
 */
export async function setText(
  node: TextNode,
  characters: string,
): Promise<void> {
  await loadNodeFonts(node);
  node.characters = characters;
}

/**
 * Save data to client storage (persists across sessions)
 * @param key - Storage key
 * @param value - Value to store (must be JSON-serializable)
 */
export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  await figma.clientStorage.setAsync(key, value);
}

/**
 * Load data from client storage
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Stored value or default
 */
export async function loadFromStorage<T>(
  key: string,
  defaultValue?: T,
): Promise<T | undefined> {
  try {
    const value = await figma.clientStorage.getAsync(key);
    return value !== undefined ? value : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Settings kept in clientStorage under `key`, cleaned by one `sanitize` on
 * the way in and on the way out, so what's saved is always what a load would
 * accept. `sanitize` takes anything — a value an older version stored, a
 * message from the UI, undefined on first run — and returns complete
 * settings. `save` resolves to the settings it stored. Storage errors are
 * logged, not thrown: a load falls back to `sanitize(undefined)`.
 */
export function createSettingsStore<T>(
  key: string,
  sanitize: (raw: unknown) => T,
): { load(): Promise<T>; save(raw: unknown): Promise<T> } {
  return {
    async load() {
      try {
        return sanitize(await figma.clientStorage.getAsync(key));
      } catch (error) {
        console.error(`Couldn't read "${key}" from clientStorage:`, error);
        return sanitize(undefined);
      }
    },
    async save(raw) {
      const settings = sanitize(raw);
      try {
        await figma.clientStorage.setAsync(key, settings);
      } catch (error) {
        console.error(`Couldn't save "${key}" to clientStorage:`, error);
      }
      return settings;
    },
  };
}

/**
 * Handle resize message from UI
 * Call this in your message handler when msg.type === "resize"
 * @param msg - Message object with width and height
 */
export function handleResize(msg: { width: number; height: number }): void {
  figma.ui.resize(msg.width, msg.height);
}
