/**
 * Color utilities for Figma plugins
 */

/**
 * Convert RGB color (0-1 range) to HEX string
 * @param {{r: number, g: number, b: number}} color - RGB color with values 0-1
 * @returns {string} HEX color string (e.g., "#FF0000")
 */
export function rgbToHex({ r, g, b }) {
  const toHex = (value) => {
    const hex = Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
    return hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert HEX string to RGB color (0-1 range)
 * @param {string} hex - HEX color string (e.g., "#FF0000" or "FF0000")
 * @returns {{r: number, g: number, b: number} | null} RGB color with values 0-1, or null if invalid
 */
export function hexToRgb(hex) {
  const cleanHex = hex.replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return null;
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return { r, g, b };
}

/**
 * Get relative luminance of a color (for contrast calculations)
 * @param {{r: number, g: number, b: number}} color - RGB color with values 0-1
 * @returns {number} Relative luminance (0-1)
 */
export function getLuminance({ r, g, b }) {
  const adjust = (c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b);
}

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * @param {{r: number, g: number, b: number}} color1 - First RGB color (0-1 range)
 * @param {{r: number, g: number, b: number}} color2 - Second RGB color (0-1 range)
 * @returns {number} Contrast ratio (1-21)
 */
export function getContrastRatio(color1, color2) {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG level
 * @param {number} ratio - Contrast ratio
 * @param {"AA" | "AAA" | "AA-large" | "AAA-large"} level - WCAG level to check
 * @returns {boolean} Whether the ratio meets the level
 */
export function meetsContrastLevel(ratio, level) {
  switch (level) {
    case "AAA":
      return ratio >= 7;
    case "AAA-large":
      return ratio >= 4.5;
    case "AA":
      return ratio >= 4.5;
    case "AA-large":
      return ratio >= 3;
    default:
      return false;
  }
}
