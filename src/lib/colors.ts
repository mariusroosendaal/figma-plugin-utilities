/**
 * Color utilities for Figma plugins. No Figma API, so either thread may
 * import them — but in a plugin that builds both threads in one pass, only
 * one of them, or Vite splits this module into a chunk the sandbox can't load.
 */

/** A color with channels 0–1, as Figma's RGB and RGBA. */
export type Rgb = { r: number; g: number; b: number; a?: number };

export type HexOptions = {
  /** Lowercase digits; uppercase by default */
  lowercase?: boolean;
  /** Prefix with "#"; true by default */
  hash?: boolean;
  /** Append the alpha byte when `a` is below 1 */
  alpha?: boolean;
};

const byte = (channel: number) =>
  Math.round(Math.min(1, Math.max(0, channel)) * 255)
    .toString(16)
    .padStart(2, "0");

/**
 * Convert an RGB color (0–1 channels, clamped) to a HEX string, "#FF0000" by
 * default.
 */
export function rgbToHex(
  { r, g, b, a }: Rgb,
  { lowercase = false, hash = true, alpha = false }: HexOptions = {},
): string {
  let hex = byte(r) + byte(g) + byte(b);
  if (alpha && a !== undefined && a < 1) hex += byte(a);
  if (!lowercase) hex = hex.toUpperCase();
  return hash ? `#${hex}` : hex;
}

/**
 * Whether a string is a six-digit HEX color, in either case. The "#" is
 * required unless `requireHash` is false.
 */
export function isValidHex(
  value: string,
  { requireHash = true }: { requireHash?: boolean } = {},
): boolean {
  return (requireHash ? /^#[0-9a-f]{6}$/i : /^#?[0-9a-f]{6}$/i).test(value);
}

/**
 * Convert a HEX string ("#FF0000" or "FF0000") to an RGB color with 0–1
 * channels, or null if it isn't six HEX digits.
 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return null;
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return { r, g, b };
}

/** Relative luminance of a color (0–1), for contrast calculations. */
export function getLuminance({ r, g, b }: Rgb): number {
  const adjust = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b);
}

/** WCAG contrast ratio between two colors (1–21). */
export function getContrastRatio(color1: Rgb, color2: Rgb): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Whether a contrast ratio meets a WCAG level. */
export function meetsContrastLevel(
  ratio: number,
  level: "AA" | "AAA" | "AA-large" | "AAA-large",
): boolean {
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
