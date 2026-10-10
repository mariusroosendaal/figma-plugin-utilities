// Message utilities
export { sendToPlugin, createMessageHandler } from "./messages";

// Color utilities
export {
  rgbToHex,
  hexToRgb,
  isValidHex,
  getLuminance,
  getContrastRatio,
  meetsContrastLevel,
} from "./colors";

// Copy helpers
export { plural, joinList, UNDO } from "./format";

// Validation utilities
export {
  validateUrl,
  validateJsonString,
  sanitizeInput,
  sanitizeName,
  validateEmail,
  validateNumber,
  isEmpty,
} from "./validation";

// Error handling utilities
export {
  formatErrorMessage,
  handleAsyncError,
  createUserErrorMessage,
  logError,
  withErrorHandling,
  safeAsync,
  parseJsonSafe,
} from "./errorHandling";

// Resize utilities
export {
  setDefaultWidth,
  getContentHeight,
  resizeToFit,
  autoResize,
} from "./resize";

// Confirmation dialogs, shown by ConfirmModal
export {
  confirmAction,
  confirmDiscardChanges,
  answerConfirm,
  confirmRequest,
} from "./confirm";
