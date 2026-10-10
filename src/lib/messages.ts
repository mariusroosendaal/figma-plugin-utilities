/**
 * Message utilities for Figma plugin UI communication.
 *
 * A plugin written in TypeScript types its messages as two unions, one per
 * direction, and annotates the helpers with them:
 *
 * @example
 * // messages.ts
 * export type ToPlugin = { type: "RUN"; options: Options } | { type: "CANCEL" };
 * export type ToUI = { type: "RESULT"; count: number };
 *
 * // PluginUI.svelte
 * const send: Send<ToPlugin> = sendToPlugin;
 * window.onmessage = createMessageHandler<ToUI>({ RESULT: (msg) => (count = msg.count) });
 *
 * Untyped calls take any message, as before.
 */

/** A message: its `type`, with its data alongside */
export type Msg = { type: string };

/** The data sent with message `K`: the message without its `type` */
export type Payload<M extends Msg, K extends M["type"]> = Omit<
  Extract<M, { type: K }>,
  "type"
>;

/** `sendToPlugin` (or `sendToUI`) for messages `M`: the data is required
 * when the message has required fields */
export type Send<M extends Msg> = <K extends M["type"]>(
  type: K,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  ...data: {} extends Payload<M, K>
    ? [data?: Payload<M, K>]
    : [data: Payload<M, K>]
) => void;

/** A handler for each message `M` the UI takes, each given its own message;
 * any name, given any message, when the messages aren't typed */
export type Handlers<M extends Msg> = string extends M["type"]
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, (msg: any) => void>
  : { [K in M["type"]]?: (msg: Extract<M, { type: K }>) => void };

/**
 * Send a message to the plugin code
 * @param type - Message type identifier
 * @param data - Additional data to send
 */
export function sendToPlugin(type: string, data: object = {}): void {
  parent.postMessage({ pluginMessage: { ...data, type } }, "*");
}

/**
 * Create a message handler with type-based routing
 * @param handlers - Object mapping message types to handler functions
 * @returns Event handler function
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
export function createMessageHandler<M extends Msg = Msg>(
  handlers: Handlers<M>,
): (event: MessageEvent) => void {
  return (event) => {
    const msg: M | undefined = event.data && event.data.pluginMessage;
    if (!msg) return;
    const handler = (
      handlers as Record<string, ((msg: M) => void) | undefined>
    )[msg.type];
    if (handler) handler(msg);
  };
}
