// Message utilities
export { sendToPlugin, createMessageHandler } from "./messages.js";

// Color utilities
export {
  rgbToHex,
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsContrastLevel,
} from "./colors.js";

// Validation utilities
export {
  validateUrl,
  validateJsonString,
  sanitizeInput,
  sanitizeName,
  validateEmail,
  validateNumber,
  isEmpty,
} from "./validation.js";

// Error handling utilities
export {
  formatErrorMessage,
  handleAsyncError,
  createUserErrorMessage,
  logError,
  withErrorHandling,
  safeAsync,
  parseJsonSafe,
  notifyError,
  notifySuccess,
  notifyWarning,
} from "./errorHandling.js";

// Resize utilities
export {
  setDefaultWidth,
  getContentHeight,
  resizeToFit,
  autoResize,
} from "./resize.js";

// Figma frame builders
export {
  loadSpecFonts,
  specTokens,
  createAutoLayoutFrame,
  createText,
  createTokenChip,
  createColorSwatch,
  createTableCell,
  createTableHeader,
} from "./figma-frame-builders.js";
export type { PaddingSpec, SpecTheme } from "./figma-frame-builders.js";
