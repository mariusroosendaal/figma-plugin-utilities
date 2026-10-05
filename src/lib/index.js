// Message utilities
export { sendToPlugin, createMessageHandler } from "./messages.js";

// Color utilities
export {
  rgbToHex,
  hexToRgb,
  isValidHex,
  getLuminance,
  getContrastRatio,
  meetsContrastLevel,
} from "./colors.ts";

// Copy helpers
export { plural, joinList } from "./format.ts";

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
} from "./errorHandling.js";

// Resize utilities
export {
  setDefaultWidth,
  getContentHeight,
  resizeToFit,
  autoResize,
} from "./resize.js";

// Confirmation dialogs, shown by ConfirmModal
export {
  confirmAction,
  confirmDiscardChanges,
  answerConfirm,
  confirmRequest,
} from "./confirm.ts";
