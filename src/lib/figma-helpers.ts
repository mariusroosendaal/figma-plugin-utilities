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

// Long enough to read: about 60ms a character, and never under `minimum`.
const readingTime = (message: string, minimum: number) =>
  Math.max(minimum, message.length * 60);

/**
 * Show an error notification: something failed, or the file needs fixing
 * @param message - What went wrong, then what to do
 * @param timeout - How long to show it (ms); by default long enough to read,
 *   5s at least
 */
export function showError(message: string, timeout?: number): void {
  figma.notify(message, {
    error: true,
    timeout: timeout ?? readingTime(message, 5000),
  });
}

/**
 * Show a success notification: the change is made. End a change to the file
 * with `UNDO` from `lib/format`.
 * @param message - What changed, with a count
 * @param timeout - How long to show it (ms); by default long enough to read,
 *   3s at least
 */
export function showSuccess(message: string, timeout?: number): void {
  figma.notify(message, { timeout: timeout ?? readingTime(message, 3000) });
}

/**
 * Show a regular notification for a run with nothing to do: an empty
 * selection, nothing to change. Not an error; say what to select or set.
 * @param message - Why nothing happened, then what to do
 * @param timeout - How long to show it (ms); by default long enough to read,
 *   4s at least
 */
export function showNotice(message: string, timeout?: number): void {
  figma.notify(message, { timeout: timeout ?? readingTime(message, 4000) });
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
export function loadFont(family: string, style: string): Promise<void> {
  return loadFontOnce({ family, style });
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
