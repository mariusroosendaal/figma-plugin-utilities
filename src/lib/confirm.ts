/**
 * Confirmation dialogs, in place of the browser's confirm(): mount one
 * ConfirmModal in the plugin's UI and it shows whatever confirmAction() asks.
 */

import { get, writable } from "svelte/store";

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
};

type ConfirmRequest = ConfirmOptions & {
  resolve: (confirmed: boolean) => void;
};

export const confirmRequest = writable<ConfirmRequest | null>(null);

/**
 * Ask the user to confirm. Resolves true on confirm; false on cancel,
 * Escape, a click outside, or when another confirmation replaces this one.
 */
export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  get(confirmRequest)?.resolve(false);
  return new Promise((resolve) => {
    confirmRequest.set({ ...options, resolve });
  });
}

/** Answer the open confirmation, if any */
export function answerConfirm(confirmed: boolean): void {
  const request = get(confirmRequest);
  if (!request) return;
  confirmRequest.set(null);
  request.resolve(confirmed);
}

/**
 * The prompt before unsaved edits are thrown away: closing a panel or
 * leaving an editor. Resolves true to discard them.
 */
export function confirmDiscardChanges(
  message = "Your changes haven't been saved.",
): Promise<boolean> {
  return confirmAction({
    title: "Discard changes?",
    message,
    confirmLabel: "Discard changes",
    cancelLabel: "Keep editing",
    destructive: true,
  });
}
