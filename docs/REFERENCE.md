# figma-plugin-utilities reference

[figma-plugin-utilities](https://github.com/mariusroosendaal/figma-plugin-utilities) — shared Svelte layout components and utility functions for Figma plugin UIs.

If `$ARGUMENTS` names a specific component or utility, show just that. Otherwise give the full reference.

## Installation

```bash
npm install figma-plugin-utilities
```

## Imports

```javascript
// UI components + utilities
import {
  PluginLayout, Header, Footer, StatusBar,
  EmptyState, ListItem, LoadingState, FieldGroup, CheckboxCard,
  sendToPlugin, createMessageHandler,
  rgbToHex, hexToRgb, getLuminance, getContrastRatio, meetsContrastLevel,
  validateUrl, validateJsonString, sanitizeInput, sanitizeName,
  validateEmail, validateNumber, isEmpty,
  formatErrorMessage, handleAsyncError, createUserErrorMessage,
  logError, withErrorHandling, safeAsync, parseJsonSafe,
  setDefaultWidth, getContentHeight, resizeToFit, autoResize,
} from "figma-plugin-utilities";

// Figma-sandbox helpers (use in code.ts only, not in UI)
import {
  sendToUI, showError, showSuccess, focusNodes, loadFont,
  getCollections, getVariables, getSelection, handleResize,
  saveToStorage, loadFromStorage,
} from "figma-plugin-utilities/lib/figma-helpers";
```

---

## Layout components

### PluginLayout

Scrollable main content area. Place between `<Header>` and `<Footer>`.

```svelte
<PluginLayout>
  <!-- Plugin content -->
</PluginLayout>
```

---

### Header

Top bar with optional left/right slots.

```svelte
<Header title="My Plugin" />

<!-- With icon buttons -->
<Header title="My Plugin">
  <svelte:fragment slot="left">
    <IconButton iconName={IconBack} on:click={goBack} />
  </svelte:fragment>
  <svelte:fragment slot="right">
    <IconButton iconName={IconSettings} on:click={openSettings} />
  </svelte:fragment>
</Header>

<!-- No bottom border -->
<Header title="Settings" noBorder />
```

Props: `title`, `noBorder`.

---

### Footer

Sticky bottom bar. Three layout variants.

```svelte
<!-- Right-aligned (default) -->
<Footer>
  <Button variant="primary" on:click={handleAction}>Create variants</Button>
</Footer>

<!-- Split: left + right slots -->
<Footer variant="split">
  <svelte:fragment slot="left">
    <Button variant="secondary" on:click={cancel}>Cancel</Button>
  </svelte:fragment>
  <svelte:fragment slot="right">
    <Button variant="primary" on:click={save}>Save settings</Button>
  </svelte:fragment>
</Footer>

<!-- Full-width -->
<Footer variant="full">
  <Button variant="primary">Generate styles</Button>
</Footer>
```

Props: `variant` (`"right"` | `"split"` | `"full"`).

---

### StatusBar

Toast notification bar. Auto-dismisses `info` and `success` after 4 seconds.

```svelte
<script>
  let status = { message: "", type: "info" };
</script>

<StatusBar
  message={status.message}
  type={status.type}
  on:close={() => (status = { message: "", type: "info" })}
/>
```

Set status from anywhere:
```javascript
status = { message: "Variables created", type: "success" };
status = { message: "Select a frame first", type: "warning" };
status = { message: "Plugin API unavailable", type: "error" };
```

Types: `"info"` | `"success"` | `"warning"` | `"error"`.

---

### EmptyState

Placeholder for empty lists or error states.

```svelte
<EmptyState message="No frames found" />

<!-- With icon and action -->
<EmptyState
  message="No variables yet"
  icon="variables"
  actions={[
    { label: "Create variables", handler: handleCreate },
    { label: "Import JSON", handler: handleImport },
  ]}
/>
```

Props: `message`, `icon`, `actions` (array of `{ label, handler }`).

---

### ListItem

Selectable row with metadata slot and optional action menu.

```svelte
<script>
  let selectedId = null;
  const menuItems = [
    { label: "Rename", value: "rename" },
    { label: "Delete", value: "delete" },
  ];
</script>

{#each items as item (item.id)}
  <ListItem
    id={item.id}
    title={item.name}
    active={selectedId === item.id}
    {menuItems}
    on:click={(e) => (selectedId = e.detail.id)}
    on:menuSelect={(e) => handleAction(e.detail.id, e.detail.action)}
  >
    <span>{item.type}</span>
  </ListItem>
{/each}
```

Props: `id`, `title`, `active`, `menuItems`.
Events: `click` (`detail.id`), `menuSelect` (`detail.id`, `detail.action`).

---

### LoadingState

Centered spinner with message.

```svelte
{#if loading}
  <LoadingState message="Creating variables..." />
{/if}
```

Props: `message`.

---

### FieldGroup

Label + input wrapper for forms.

```svelte
<FieldGroup label="Collection name">
  <Input bind:value={name} placeholder="e.g. Colors" />
</FieldGroup>

<FieldGroup label="Mode">
  <Dropdown menuItems={modes} bind:value={selectedMode} />
</FieldGroup>
```

Props: `label`.

---

### CheckboxCard

Large checkbox with card styling, good for multi-select option lists.

```svelte
<CheckboxCard bind:checked={includeSmall}>
  Small
  <svelte:fragment slot="secondary">— 375px</svelte:fragment>
</CheckboxCard>

<CheckboxCard bind:checked={includeLarge} disabled>
  Large
</CheckboxCard>
```

Props: `checked`, `disabled`. Slot: `secondary` (optional sub-label).

---

## Message utilities

### `sendToPlugin` (UI → plugin thread)

```javascript
import { sendToPlugin } from "figma-plugin-utilities";

// Send type only
sendToPlugin("run-export");

// Send type + payload
sendToPlugin("create-variables", { collection: "Colors", values: [...] });
```

### `createMessageHandler` (plugin thread → UI)

```javascript
import { createMessageHandler } from "figma-plugin-utilities";

window.onmessage = createMessageHandler({
  success: (msg) => {
    status = { message: msg.message, type: "success" };
  },
  error: (msg) => {
    status = { message: msg.message, type: "error" };
  },
  data: (msg) => {
    items = msg.items;
  },
});
```

---

## Color utilities

```javascript
import { hexToRgb, rgbToHex, getLuminance, getContrastRatio, meetsContrastLevel } from "figma-plugin-utilities";

// Figma uses 0–1 float range for RGB
const rgb = hexToRgb("#FF0000");       // { r: 1, g: 0, b: 0 }
const hex = rgbToHex({ r: 1, g: 0, b: 0 });  // "#FF0000"

// Luminance (0–1, used to compute contrast)
const lum = getLuminance({ r: 1, g: 0, b: 0 });

// WCAG contrast
const ratio = getContrastRatio(color1, color2);  // e.g. 4.5
const passes = meetsContrastLevel(ratio, "AA");  // true / false
// Levels: "AA" (4.5:1), "AAA" (7:1), "AA-large" (3:1)
```

---

## Validation utilities

```javascript
import {
  validateUrl, validateJsonString,
  sanitizeInput, sanitizeName,
  validateEmail, validateNumber, isEmpty,
} from "figma-plugin-utilities";

const url = validateUrl("https://example.com");
// { valid: true } or { valid: false, error: "Invalid URL format" }

const json = validateJsonString('{"key": "value"}');
// { valid: true, parsed: { key: "value" } } or { valid: false, error: "..." }

const clean = sanitizeName("My Plugin!!!");     // "My Plugin" — strips special chars
const safe = sanitizeInput("  hello  ", 50);    // trims + enforces maxLength

validateEmail("user@example.com");             // { valid: true }
validateNumber("42", { min: 1, max: 100 });    // { valid: true, value: 42 }
isEmpty("");       // true
isEmpty([]);       // true
isEmpty("hello");  // false
```

---

## Error handling utilities

```javascript
import {
  safeAsync, parseJsonSafe,
  formatErrorMessage, handleAsyncError,
  createUserErrorMessage, logError, withErrorHandling,
} from "figma-plugin-utilities";

// Wrap any async operation — returns { ok, value } or { ok: false, error }
const result = await safeAsync(() => fetch(url), "Loading data");
if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error.userMessage);
}

// Safe JSON parse
const parsed = parseJsonSafe(jsonString);
// { ok: true, value: {...} } or { ok: false, error: "..." }

// Format raw errors into readable strings
const msg = formatErrorMessage(error);

// Create a user-facing error message from a caught error
const userMsg = createUserErrorMessage(error, "Failed to create variables");

// Log errors with context
logError(error, { context: "createVariables", nodeId });

// Wrap an async function with error handling
const safeCreate = withErrorHandling(createVariables, "Creating variables");
await safeCreate(data);

// Handle async errors in event handlers
handleAsyncError(asyncFn, "Operation failed");
```

---

## Resize utilities

Auto-resize the plugin window to fit content. The UI sends a `"resize"` message; `handleResize` in `code.ts` applies it.

```svelte
<!-- PluginUI.svelte -->
<script>
  import { autoResize } from "figma-plugin-utilities";
  let container;

  // Watch for content changes and resize automatically
  $: if (container) autoResize({ container, minHeight: 200, maxHeight: 600 });
</script>

<div bind:this={container}>
  <!-- content that may grow/shrink -->
</div>
```

```typescript
// code.ts — handle the resize message
import { handleResize } from "figma-plugin-utilities/lib/figma-helpers";

figma.ui.onmessage = (msg) => {
  if (msg.type === "resize") handleResize(msg);
};
```

- `setDefaultWidth(width)` — set the default width used for all resize calls
- `getContentHeight(container)` — measure element's `scrollHeight`
- `resizeToFit(options?)` — one-shot resize: `{ width, height, minHeight, maxHeight, padding, container }`
- `autoResize(options)` — watch a container via `ResizeObserver`, returns a cleanup function: `{ container, width, minHeight, maxHeight, padding, debounce, threshold }`

---

## Figma helpers (code.ts only)

These run in the plugin sandbox — import them in `code.ts`, not in Svelte UI files.

### `sendToUI`

```typescript
import { sendToUI } from "figma-plugin-utilities/lib/figma-helpers";

sendToUI("success", { message: "Variables created!" });
sendToUI("data", { items: figma.currentPage.children });
```

### `showError` / `showSuccess`

```typescript
import { showError, showSuccess } from "figma-plugin-utilities/lib/figma-helpers";

showError("Select at least one frame");   // default 5s timeout
showSuccess("Variables created!", 3000);
```

### `getCollections` / `getVariables`

```typescript
import { getCollections, getVariables } from "figma-plugin-utilities/lib/figma-helpers";

const collections = await getCollections();  // VariableCollection[]
const colorVars = await getVariables("COLOR");  // Variable[] — type is optional
```

### `getSelection`

```typescript
import { getSelection } from "figma-plugin-utilities/lib/figma-helpers";

const all = getSelection();                          // all selected nodes
const frames = getSelection<FrameNode>("FRAME");     // filtered by type
```

### `handleResize`

```typescript
import { handleResize } from "figma-plugin-utilities/lib/figma-helpers";

figma.ui.onmessage = (msg) => {
  if (msg.type === "resize") handleResize(msg);  // resizes the plugin window
};
```

### `focusNodes`

```typescript
import { focusNodes } from "figma-plugin-utilities/lib/figma-helpers";

focusNodes(figma.currentPage.selection);
// or
focusNodes([specificNode]);
```

### `loadFont`

```typescript
import { loadFont } from "figma-plugin-utilities/lib/figma-helpers";

await loadFont("Inter", "Regular");
await loadFont("Inter", "Bold");
```

### `saveToStorage` / `loadFromStorage`

```typescript
import { saveToStorage, loadFromStorage } from "figma-plugin-utilities/lib/figma-helpers";

await saveToStorage("settings", { width: 300, includeAll: true });

// Second argument is the default value if nothing is stored yet
const settings = await loadFromStorage("settings", { width: 300, includeAll: false });
```
