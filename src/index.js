// Types, for `import type { DataTableRow, Send } from "figma-plugin-utilities"`
/** @typedef {import("./components/DataTable.svelte").Column} DataTableColumn */
/** @typedef {import("./components/DataTable.svelte").Cell} DataTableCell */
/** @typedef {import("./components/DataTable.svelte").Row} DataTableRow */
/** @typedef {import("./lib/messages").Msg} Msg */
/**
 * @template {Msg} M
 * @typedef {import("./lib/messages").Send<M>} Send
 */
/**
 * @template {Msg} M
 * @typedef {import("./lib/messages").Handlers<M>} Handlers
 */

// Re-export all components
export {
  CheckboxCard,
  EmptyState,
  FieldGroup,
  Footer,
  ListItem,
  LoadingState,
  PluginLayout,
  Section,
  StatusBar,
  DataTable,
  Header,
  CodeExportModal,
  FieldGrid,
  LadderBadges,
  SteppedField,
  RampCurve,
  MappingChip,
  ConfirmModal,
} from "./components/index.js";

// Re-export all utilities
export {
  // Messages
  sendToPlugin,
  createMessageHandler,
  // Colors
  rgbToHex,
  hexToRgb,
  isValidHex,
  getLuminance,
  getContrastRatio,
  meetsContrastLevel,
  // Copy
  plural,
  UNDO,
  joinList,
  // Validation
  validateUrl,
  validateJsonString,
  sanitizeInput,
  sanitizeName,
  validateEmail,
  validateNumber,
  isEmpty,
  // Error handling
  formatErrorMessage,
  handleAsyncError,
  createUserErrorMessage,
  logError,
  withErrorHandling,
  safeAsync,
  parseJsonSafe,
  // Resize
  setDefaultWidth,
  getContentHeight,
  resizeToFit,
  autoResize,
  // Confirmation dialogs
  confirmAction,
  confirmDiscardChanges,
  answerConfirm,
  confirmRequest,
} from "./lib/index.js";
