// Types, for `import type { DataTableRow, Send } from "figma-plugin-utilities"`
export type {
  Column as DataTableColumn,
  Cell as DataTableCell,
  Row as DataTableRow,
} from "./components/data-table";
export type { Msg, Send, Handlers } from "./lib/messages";

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
} from "./components/index";

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
} from "./lib/index";
