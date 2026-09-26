# Changelog

## [Unreleased]

### Added
- **ValueTable** — named rows with a value per column, such as a set's size at each breakpoint, from Type Tools' and Spacing Sets' sets tables. Rows are buttons that open the `editor` slot under them; each takes badges and a trailing button in the `badges` and `action` slots. Values are badges, or variable chips where they alias a variable, colored as new or changed; removed rows are colored and can't be selected, one column can be marked, headers can be buttons that pick it, and a legend says what the colors mean

## [0.4.0] - 2026-09-21

### Added
- `figma-frame-builders.ts` — new module with Figma frame and component builder utilities, imported from `figma-plugin-utilities/lib/figma-frame-builders` (its own export entry). They mirror the Vitrine spec library — colors, typography, spacing and layer names (`label` chip and text, a `tokens` row in token cells, `title` in both header variants):
  - `createAutoLayoutFrame` — creates a `FrameNode` with auto-layout configured
  - `createAutoLayoutComponent` — creates a `ComponentNode` with auto-layout configured
  - `createText` — creates a styled `TextNode`
  - `createTokenChip` — creates a rounded chip frame for displaying color tokens
  - `createColorSwatch` — creates a color swatch frame
  - `createTableCell` — creates a table cell frame
  - `createTableHeader` — creates a table header frame
  - `loadSpecFonts` — loads Inter and IBM Plex Mono font faces in parallel
  - `specTokens` — design token constants (accent colors, font specs, light/dark themes with an optional `headerBorder`)
  - `PaddingSpec`, `SpecTheme`, `NodeKind` and `NodeFor` types

### Removed
- The dev-mode `console.warn` **FieldGroup** logged when `label` was set without `labelFor` — a `Dropdown` is a button and cannot be a `<label for>` target, so it fired on correct code. Dropped in the a11y pass, recorded late

### Fixed
- **StatusBar** — the default `info` type sets `color: var(--figma-color-text)`. The `error`, `success` and `warning` types each set a foreground; the default one relied on inheritance, and nothing up the tree sets `color`, so the message rendered in the UA's black on the dark theme's grey bar
- **EmptyState** — the actions are a keyed `{#each}`, so swapping one action for another reuses the right button rather than repainting the row
- **docs** — `figma-frame-builders` is documented, `sanitizeInput` no longer claims to escape HTML (it stringifies, truncates, strips control characters and trims), and `formatErrorMessage`, `handleAsyncError`, `withErrorHandling` and `logError` are documented with their real signatures. `withErrorHandling(fn, operation)` calls `fn()` with no arguments and returns its result; it was documented as returning a wrapped function

## [0.3.1] - 2026-05-13

### Added
- ESLint configuration with TypeScript and Svelte support for code linting
- Prettier setup with Svelte plugin for consistent code formatting
- `lint` and `prettier` npm scripts for development workflow

### Changed
- Updated **ListItem** and **StatusBar** to use icon imports from `figma-ui3-kit-svelte/icons` after the UI kit icon export restructure.

## [0.3.0] - 2026-05-06

WCAG 2.2 AA accessibility audit and remediation across all components.

### Added
- `class` prop passthrough to **ListItem**, **LoadingState**, and **StatusBar** — consistent with other components
- `role="alert"` for error/warning and `role="status"` for info/success on **StatusBar** — messages are now announced by screen readers on insertion
- `"AAA-large"` case (4.5:1) to `meetsContrastLevel` in `lib/colors.js` — covers WCAG 1.4.6 large text at AAA level
- GitHub Actions publish workflow (`.github/workflows/publish.yml`) — triggers `npm publish` on GitHub release creation
- `aria-pressed={active}` to **ListItem** — communicates selection state to assistive technology
- Space key activation to **ListItem** — keyboard users can now toggle items with Space as well as Enter
- `ariaLabel="{title} options"` to the **ListItem** menu `IconButton` — gives the icon-only button an accessible name
- `role="status"` to **LoadingState** — loading message is announced as a polite live region
- `aria-hidden="true"` to the decorative icon in **EmptyState** — prevents redundant AT announcement
- `aria-disabled` attribute to **CheckboxCard** — reflects disabled state without removing from the accessibility tree
- Dev-mode `console.warn` to **FieldGroup** when `label` is provided but `labelFor` is empty

### Changed
- **Header**: outer element changed from `<div>` to `<header>`; title changed from `<h2>` to `<h1>` (plugin UI runs in its own iframe, so the heading hierarchy starts fresh)
- **Footer**: outer element changed from `<div>` to `<footer>`
- **CheckboxCard**: removed `role="button"` and `tabindex` from the wrapper div — the native checkbox input is the sole interactive/focusable element; the wrapper remains clickable for mouse users via a delegating click handler
- **CheckboxCard**: added `user-select: none` to prevent text selection on double-click

## [0.1.0] - 2026-04-17

Initial release as `figma-plugin-utilities`.

### Added
- **PluginLayout** — main content wrapper with scrollable area
- **Header** — header bar with left/center/right slots and optional title
- **Footer** — footer bar with right, split, and full layout variants
- **StatusBar** — toast-style notifications with auto-dismiss for info/success types
- **EmptyState** — empty/error state display with optional icon and action buttons
- **ListItem** — selectable list item with metadata slot and context menu
- **LoadingState** — centered loading indicator
- **FieldGroup** — label + input wrapper for form fields
- **CheckboxCard** — large-target checkbox with card styling
- `lib/messages.js` — `sendToPlugin` and `createMessageHandler`
- `lib/colors.js` — `rgbToHex`, `hexToRgb`, `getLuminance`, `getContrastRatio`, `meetsContrastLevel`
- `lib/validation.js` — `validateUrl`, `validateJsonString`, `validateEmail`, `validateNumber`, `sanitizeName`, `sanitizeInput`, `isEmpty`
- `lib/errorHandling.js` — `safeAsync`, `parseJsonSafe`, `notifyError`, `notifySuccess`, `notifyWarning`, and more
- `lib/resize.js` — `resizeToFit`, `autoResize`, `setDefaultWidth`, `getContentHeight`
- `lib/figma-helpers.ts` — `sendToUI`, `showError`, `showSuccess`, `getCollections`, `getVariables`, `getSelection`, `focusNodes`, `loadFont`, `saveToStorage`, `loadFromStorage`, `handleResize`
