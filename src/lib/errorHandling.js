/**
 * Error handling utilities
 *
 * Provides standardized error handling functions for consistent
 * error messages and error handling patterns across the plugin.
 */

/**
 * @typedef {Object} FormattedError
 * @property {string} message - Technical error message
 * @property {string} userMessage - User-friendly error message
 * @property {string} [technical] - Stack trace or detailed info
 */

/**
 * Format an error into a user-friendly message
 * @param {unknown} error - The error to format
 * @param {string} [context] - Optional context to add to the message
 * @returns {FormattedError}
 */
export function formatErrorMessage(error, context) {
  let message = "An unexpected error occurred";
  let technical = "";

  if (error instanceof Error) {
    message = error.message;
    technical = error.stack || error.message;
  } else if (typeof error === "string") {
    message = error;
    technical = error;
  } else {
    technical = String(error);
    message = "An unknown error occurred";
  }

  // Add context if provided
  if (context) {
    message = `${context}: ${message}`;
  }

  // Create user-friendly version by removing technical details
  let userMessage = message;

  // Common error patterns to make more user-friendly
  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    userMessage =
      "Network error: Could not connect to the server. Please check your internet connection and try again.";
  } else if (message.includes("CORS")) {
    userMessage =
      "CORS error: The resource host does not allow plugin access. Try resources from allowed domains.";
  } else if (message.includes("JSON")) {
    userMessage = "Invalid JSON format. Please check your data and try again.";
  } else if (message.includes("not found")) {
    userMessage = message
      .replace(/not found/gi, "not found")
      .replace(/^Error: /, "");
  } else if (message.includes("Missing")) {
    userMessage = message.replace(/^Error: /, "");
  }

  return {
    message,
    userMessage,
    technical: technical || undefined,
  };
}

/**
 * Handle async errors with standardized formatting
 * @param {unknown} error - The error to handle
 * @param {string} operation - Description of the operation that failed
 * @returns {FormattedError}
 */
export function handleAsyncError(error, operation) {
  return formatErrorMessage(error, operation);
}

/**
 * Create a user-friendly error message for UI display
 * @param {unknown} error - The error to format
 * @param {string} operation - Description of the operation that failed
 * @returns {string}
 */
export function createUserErrorMessage(error, operation) {
  return handleAsyncError(error, operation).userMessage;
}

/**
 * Log error with context (for debugging)
 * @param {unknown} error - The error to log
 * @param {string} context - Context description
 */
export function logError(error, context) {
  const formatted = formatErrorMessage(error, context);
  console.error(`[${context}]`, formatted.message);
  if (formatted.technical && formatted.technical !== formatted.message) {
    console.error("Technical details:", formatted.technical);
  }
}

/**
 * Wrap an async function with error handling
 * @template T
 * @param {() => Promise<T>} fn - The async function to wrap
 * @param {string} operation - Description of the operation
 * @returns {Promise<T>}
 */
export async function withErrorHandling(fn, operation) {
  try {
    return await fn();
  } catch (error) {
    logError(error, operation);
    throw error;
  }
}

/**
 * Wrap an async function and return a result object instead of throwing
 * @template T
 * @param {() => Promise<T>} fn - The async function to wrap
 * @param {string} operation - Description of the operation
 * @returns {Promise<{ ok: true, value: T } | { ok: false, error: FormattedError }>}
 */
export async function safeAsync(fn, operation) {
  try {
    const value = await fn();
    return { ok: true, value };
  } catch (error) {
    const formatted = handleAsyncError(error, operation);
    return { ok: false, error: formatted };
  }
}

/**
 * Parse JSON safely without throwing
 * @param {string} jsonString - The JSON string to parse
 * @returns {{ ok: true, value: any } | { ok: false, error: string }}
 */
export function parseJsonSafe(jsonString) {
  try {
    const value = JSON.parse(jsonString);
    return { ok: true, value };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

/**
 * Show an error notification to the user with standardized options.
 * Use this in code.ts files for consistent error notifications.
 * @param {string} message - The error message to display
 * @param {unknown} [error] - Optional error object for logging
 * @param {string} [context] - Optional context for logging
 */
export function notifyError(message, error, context) {
  if (error) {
    logError(error, context || message);
  }
  // @ts-ignore - figma global is available in plugin context
  if (typeof figma !== "undefined") {
    figma.notify(message, { error: true });
  }
}

/**
 * Show a success notification to the user with standardized options.
 * @param {string} message - The success message to display
 */
export function notifySuccess(message) {
  // @ts-ignore - figma global is available in plugin context
  if (typeof figma !== "undefined") {
    figma.notify(message);
  }
}

/**
 * Show a warning notification to the user.
 * @param {string} message - The warning message to display
 */
export function notifyWarning(message) {
  // @ts-ignore - figma global is available in plugin context
  if (typeof figma !== "undefined") {
    figma.notify(message, { timeout: 5000 });
  }
}
