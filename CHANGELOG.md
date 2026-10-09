# Changelog

## [Unreleased]

### Added
- `figma-plugin-utilities/vite` — `figmaPluginConfig(import.meta.url)`, a plugin's whole Vite config: each thread built on its own (`vite build && vite build --mode code`), so both may import the same module, the UI's CSS and JS inlined into `dist/index.html`, `src/manifest.json` copied, at `es2017`. `moduleScript` inlines the UI as a module script. `ui3InlineSvg` and `inlineFigmaHtml` are exported too. `vite` and `@sveltejs/vite-plugin-svelte` are optional peer dependencies
- **EmptyState** — `iconSize`, the icon's size in px (24 by default), for an icon given as SVG markup
- **FieldGroup** — `hint`, a line of secondary text under the control: what to enter, or what the choice does. Empty shows none, so a conditional hint is a string; the `hint` slot takes markup and always shows. Like the label, it can't be selected. The hint and the control's error take the label's size: body-medium, or body-small in a small group. The Figma component has the hint too, which Code Connect and the mockup builder read

### Changed
- `resizeToFit` — measures only the `container` you pass, and without one or a `height` warns and leaves the window as it is. It measured `document.body` by default, which fills the window, so the window could grow but never shrink

### Fixed
- `sendToUI`, `sendToPlugin` — a `type` field in the data no longer replaces the message's type
- `formatErrorMessage` — the network, CORS and JSON messages follow the copy guidelines: no "Please" or "Network error:" prefix
- **FieldGroup** — `labelFor` ties the label to its control, so clicking the label focuses an `Input` or `Textarea`. It was passed to Label as `for`, which Label doesn't take, so no label was tied to anything
- **EmptyState** — `icon`, `action` and `actions` have types, so a plugin's `svelte-check` with `checkJs` passes
- `autoResize` — the options default to `{ container: null }`, which matches their type; without a container it still warns and does nothing

## [0.5.1] - 2026-10-07

### Changed
- **figma-ui3-kit-svelte** is a peer dependency, `^0.7.0`: install it beside the utilities. 0.7.0 is what `confirmDiscardChanges` needs for Modal's `beforeClose`, and **ConfirmModal** over another modal for Escape to close only the top one

## [0.5.0] - 2026-10-07

### Added
- **ConfirmModal** with `confirmAction`, from Data Mapper — a confirmation in a small modal in place of the browser's `confirm()`, resolving true or false, its buttons stacked at full width in a window too narrow for them side by side — and `confirmDiscardChanges`, the "Discard changes?" prompt before unsaved edits go, for Modal's `beforeClose`
- **MappingChip** — one side of a source → target row as a filled 24px chip: a button with a lead icon or chit, a truncating `label`, an optional `preview` and `count`. `tone` is `default`, `secondary` or `component`; `selected` draws the selection border
- **FieldGrid** — fields side by side in `columns` equal columns (2 by default) that shrink below their content
- **SteppedField** — a field with − and + icon buttons after it, named by `downLabel` and `upLabel`, firing `step` with -1 or 1
- **LadderBadges** — a scale's sizes as badges, outlined where used and `archived` where not, each with a tooltip
- **RampCurve** — a ramp's quadratic Bézier at one breakpoint, the others faint behind it. At the smallest and largest breakpoint the ends and the bend are draggable or stepped with the arrow keys. Fires `change` and `select`
- **CodeExportModal** — read-only code in a modal with a copy button that reads "Copied" for two seconds, and a `controls` slot for options above the code
- **Section** — a titled group of fields as in Figma's panels, with icon buttons in an `actions` slot. It pads its own content and shrinks with its container
- **DataTable** — named rows with a cell per column. Selectable rows open an `editor` slot; with `selectable={false}` it's a read-only table. Rows take badges with tooltips, and cells are badges, variable chips or text, colored as new, changed or danger
- `lib/scale` — responsive scale math with no Figma API: the ramp's Bézier (`bezier`, `clampPosition`, `levelT`), `blendAt`, `valueAtWidth`, fallback breakpoint widths (`FALLBACK_WIDTHS`, `isBreakpointName`, `widthsFor`), `fluidClamp`, `trimNumber`, `lerp` and `roundHalfDown`
- `lib/figma-variables` — `isVariableAlias`, `isColorValue`, `toRgba`, `getVariableLookup`, and `resolveVariableValue` and `resolveVariableValueAsync`, which follow aliases at a mode; the async one follows library variables too
- **figma-helpers** — `fontsOf`, `loadFontOnce`, `loadNodeFonts` and `setText` write text in the layer's own fonts, loading each font once per run; `createSettingsStore` keeps settings in clientStorage, cleaned by one `sanitize` on load and on save
- `isValidHex` — six HEX digits in either case, the "#" required unless `requireHash` is false
- `plural` and `joinList` — "3 layers", "a, b and c"; from the root, or `lib/format` in code.ts
- **figma-helpers** — `showNotice`, a regular notification for a run with nothing to do, where `showError` is for failures
- `UNDO` — "Press Ctrl/Cmd+Z to undo.", the last sentence of a success notification for a change to the file

### Changed
- **ListItem** — an `actions` slot puts buttons inside the item, after its text and outside its clickable area, in the Figma component too (**Actions slot**)
- **Header** — `level` sets the title's heading level (1 by default). The left padding is 8px when the left slot has content and 16px before a title alone, in the Figma component too
- **Footer** — a kit `Text` at the edge of a split footer sits 16px in, where buttons sit 8px in
- `rgbToHex` takes `lowercase`, `hash` and `alpha` options and clamps channels to 0–1
- The color utilities are TypeScript, with their own `lib/colors` entry for code.ts
- `loadFont` loads each font once per run
- `showError` and `showSuccess` stay up long enough to read by default, about 60ms a character, and at least 5s and 3s
- **figma-frame-builders** — `createTokenChip` pads its label 6px on each side, and `specTokens.accentColors.green` is #40C459, as in the Vitrine spec library

### Removed
- `getCollections`, `getVariables` and `getSelection` — call the Figma API directly
- `saveToStorage` and `loadFromStorage` — use `createSettingsStore`
- `notifyError`, `notifySuccess` and `notifyWarning`, which did nothing in the UI — use `showError` and `showSuccess` in code.ts

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
- **StatusBar** — the default `info` type sets `color: var(--figma-color-text)`. The `error`, `success` and `warning` types each set a foreground; the default one relied on inheritance, and nothing up the tree sets `color`, so the message rendered in the UA's black on the dark theme's gray bar
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
