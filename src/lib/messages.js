/**
 * Message utilities for Figma plugin UI communication
 */

/**
 * Send a message to the plugin code
 * @param {string} type - Message type identifier
 * @param {object} data - Additional data to send
 */
export function sendToPlugin(type, data = {}) {
  parent.postMessage({ pluginMessage: { type, ...data } }, "*");
}

/**
 * Create a message handler with type-based routing
 * @param {Record<string, (msg: any) => void>} handlers - Object mapping message types to handler functions
 * @returns {(event: MessageEvent) => void} Event handler function
 *
 * @example
 * window.onmessage = createMessageHandler({
 *   populateOptions: (msg) => {
 *     collections = msg.options;
 *   },
 *   generationComplete: () => {
 *     isGenerating = false;
 *   }
 * });
 */
export function createMessageHandler(handlers) {
  return (event) => {
    const msg = event.data && event.data.pluginMessage;
    if (!msg) return;
    const handler = handlers[msg.type];
    if (handler) handler(msg);
  };
}
