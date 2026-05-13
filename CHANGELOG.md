# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.1] - 2026-05-13

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
