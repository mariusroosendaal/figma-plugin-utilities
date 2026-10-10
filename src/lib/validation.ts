/**
 * Validation and sanitization utilities
 *
 * Provides input validation and sanitization for user-provided data
 */

/**
 * Validate a URL string
 * @param url - The URL to validate
 * @param options - Validation options; `required` defaults to true
 */
export function validateUrl(
  url: string,
  options: { required?: boolean } = { required: true },
): { valid: boolean; error?: string } {
  if (!url || typeof url !== "string" || !url.trim()) {
    if (options.required) {
      return { valid: false, error: "URL is required" };
    }
    return { valid: true };
  }

  const trimmed = url.trim();

  try {
    const urlObj = new URL(trimmed);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: "URL must use http or https protocol",
      };
    }

    // Validate hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return {
        valid: false,
        error: "Invalid URL: missing hostname",
      };
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(trimmed)) {
        return {
          valid: false,
          error: "URL contains invalid protocol",
        };
      }
    }

    return { valid: true };
  } catch {
    return {
      valid: false,
      error: "Invalid URL format",
    };
  }
}

/**
 * Validate a JSON string
 * @param jsonString - The JSON string to validate
 * @param options - Validation options: `maxSizeKB` caps the size,
 *   `requireObject` requires the root to be an object
 */
export function validateJsonString(
  jsonString: string,
  options: { maxSizeKB?: number; requireObject?: boolean } = {},
): { valid: boolean; error?: string; parsed?: unknown } {
  if (!jsonString || typeof jsonString !== "string") {
    return {
      valid: false,
      error: "JSON string is required",
    };
  }

  const trimmed = jsonString.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: "JSON string is empty",
    };
  }

  // Check size if specified
  if (options.maxSizeKB) {
    const sizeKB = Math.round(trimmed.length / 1024);
    if (sizeKB > options.maxSizeKB) {
      return {
        valid: false,
        error: `JSON is too large (${sizeKB} KB). Maximum size: ${options.maxSizeKB} KB`,
      };
    }
  }

  // Try to parse JSON
  try {
    const parsed = JSON.parse(trimmed);

    // If requireObject is true, ensure it's an object
    if (
      options.requireObject &&
      (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
    ) {
      return {
        valid: false,
        error: "JSON must be an object",
      };
    }

    return {
      valid: true,
      parsed,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid JSON format";
    return {
      valid: false,
      error: message,
    };
  }
}

/**
 * Sanitize user input string
 * @param input - The input to sanitize
 * @param maxLength - Maximum length
 */
export function sanitizeInput(input: unknown, maxLength?: number): string {
  if (input === null || input === undefined) {
    return "";
  }

  let str = String(input);

  // Apply length limit if provided
  if (maxLength && str.length > maxLength) {
    str = str.slice(0, maxLength);
  }

  // Remove null bytes and control characters (except newlines and tabs)
  // eslint-disable-next-line no-control-regex
  str = str.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");

  // Trim whitespace
  str = str.trim();

  return str;
}

/**
 * Sanitize a name/title for storage
 * @param name - The name to sanitize
 * @param maxLength - Maximum length, 200 by default
 */
export function sanitizeName(name: unknown, maxLength = 200): string {
  const sanitized = sanitizeInput(name, maxLength);

  // Remove problematic characters but keep basic punctuation
  // Allow: letters, numbers, spaces, hyphens, underscores, dots
  return sanitized.replace(/[^a-zA-Z0-9\s\-_.]/g, "") || "Untitled";
}

/**
 * Validate an email address
 * @param email - The email to validate
 */
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  if (!email || typeof email !== "string" || !email.trim()) {
    return { valid: false, error: "Email is required" };
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true };
}

/**
 * Validate a number within range
 * @param value - The value to validate
 * @param options - Validation options: `min`, `max`, and `integer` (must be
 *   an integer)
 */
export function validateNumber(
  value: unknown,
  options: { min?: number; max?: number; integer?: boolean } = {},
): { valid: boolean; error?: string; value?: number } {
  const num = Number(value);

  if (isNaN(num)) {
    return { valid: false, error: "Must be a number" };
  }

  if (options.integer && !Number.isInteger(num)) {
    return { valid: false, error: "Must be an integer" };
  }

  if (options.min !== undefined && num < options.min) {
    return { valid: false, error: `Must be at least ${options.min}` };
  }

  if (options.max !== undefined && num > options.max) {
    return { valid: false, error: `Must be at most ${options.max}` };
  }

  return { valid: true, value: num };
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array)
 * @param value - The value to check
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
}
