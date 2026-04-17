/**
 * Validation and sanitization utilities
 *
 * Provides input validation and sanitization for user-provided data
 */

/**
 * Validate a URL string
 * @param {string} url - The URL to validate
 * @param {Object} [options] - Validation options
 * @param {boolean} [options.required=true] - Whether URL is required
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUrl(url, options = { required: true }) {
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
  } catch (err) {
    return {
      valid: false,
      error: "Invalid URL format",
    };
  }
}

/**
 * Validate a JSON string
 * @param {string} jsonString - The JSON string to validate
 * @param {Object} [options] - Validation options
 * @param {number} [options.maxSizeKB] - Maximum size in KB
 * @param {boolean} [options.requireObject] - Whether root must be an object
 * @returns {{ valid: boolean, error?: string, parsed?: unknown }}
 */
export function validateJsonString(jsonString, options = {}) {
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
 * @param {unknown} input - The input to sanitize
 * @param {number} [maxLength] - Maximum length
 * @returns {string}
 */
export function sanitizeInput(input, maxLength) {
  if (input === null || input === undefined) {
    return "";
  }

  let str = String(input);

  // Apply length limit if provided
  if (maxLength && str.length > maxLength) {
    str = str.slice(0, maxLength);
  }

  // Remove null bytes and control characters (except newlines and tabs)
  str = str.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");

  // Trim whitespace
  str = str.trim();

  return str;
}

/**
 * Sanitize a name/title for storage
 * @param {unknown} name - The name to sanitize
 * @param {number} [maxLength=200] - Maximum length
 * @returns {string}
 */
export function sanitizeName(name, maxLength = 200) {
  const sanitized = sanitizeInput(name, maxLength);

  // Remove problematic characters but keep basic punctuation
  // Allow: letters, numbers, spaces, hyphens, underscores, dots
  return sanitized.replace(/[^a-zA-Z0-9\s\-_.]/g, "") || "Untitled";
}

/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
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
 * @param {unknown} value - The value to validate
 * @param {Object} [options] - Validation options
 * @param {number} [options.min] - Minimum value
 * @param {number} [options.max] - Maximum value
 * @param {boolean} [options.integer] - Must be an integer
 * @returns {{ valid: boolean, error?: string, value?: number }}
 */
export function validateNumber(value, options = {}) {
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
 * @param {unknown} value - The value to check
 * @returns {boolean}
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
}
