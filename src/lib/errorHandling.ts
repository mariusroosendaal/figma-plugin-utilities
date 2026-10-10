/**
 * Error handling utilities
 *
 * Provides standardized error handling functions for consistent
 * error messages and error handling patterns across the plugin.
 */

export interface FormattedError {
  /** Technical error message */
  message: string;
  /** User-friendly error message */
  userMessage: string;
  /** Stack trace or detailed info */
  technical?: string;
}

/**
 * Format an error into a user-friendly message
 * @param error - The error to format
 * @param context - Optional context to add to the message
 */
export function formatErrorMessage(
  error: unknown,
  context?: string,
): FormattedError {
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
      "Couldn't connect to the server. Check your internet connection and try again.";
  } else if (message.includes("CORS")) {
    userMessage =
      "The resource host doesn't allow plugin access. Try resources from allowed domains.";
  } else if (message.includes("JSON")) {
    userMessage =
      "Couldn't read the data as JSON. Check its format and try again.";
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
 * @param error - The error to handle
 * @param operation - Description of the operation that failed
 */
export function handleAsyncError(
  error: unknown,
  operation: string,
): FormattedError {
  return formatErrorMessage(error, operation);
}

/**
 * Create a user-friendly error message for UI display
 * @param error - The error to format
 * @param operation - Description of the operation that failed
 */
export function createUserErrorMessage(
  error: unknown,
  operation: string,
): string {
  return handleAsyncError(error, operation).userMessage;
}

/**
 * Log error with context (for debugging)
 * @param error - The error to log
 * @param context - Context description
 */
export function logError(error: unknown, context: string): void {
  const formatted = formatErrorMessage(error, context);
  console.error(`[${context}]`, formatted.message);
  if (formatted.technical && formatted.technical !== formatted.message) {
    console.error("Technical details:", formatted.technical);
  }
}

/**
 * Wrap an async function with error handling
 * @param fn - The async function to wrap
 * @param operation - Description of the operation
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  operation: string,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(error, operation);
    throw error;
  }
}

/**
 * Wrap an async function and return a result object instead of throwing
 * @param fn - The async function to wrap
 * @param operation - Description of the operation
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  operation: string,
): Promise<{ ok: true; value: T } | { ok: false; error: FormattedError }> {
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
 * @param jsonString - The JSON string to parse
 */
export function parseJsonSafe(
  jsonString: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): { ok: true; value: any } | { ok: false; error: string } {
  try {
    const value = JSON.parse(jsonString);
    return { ok: true, value };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}
