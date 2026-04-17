# figma-plugin-utilities

Shared Svelte components and utilities for Figma plugins.

## Installation

```bash
npm install figma-plugin-ulities
```

## Usage

### Import Everything

```javascript
import {
  // Components
  PluginLayout,
  Header,
  Footer,
  StatusBar,
  EmptyState,
  ListItem,
  LoadingState,
  FieldGroup,
  CheckboxCard,
  // Utilities
  sendToPlugin,
  createMessageHandler,
  rgbToHex,
  hexToRgb,
  validateUrl,
  validateJsonString,
  sanitizeName,
} from "figma-plugin-utilities";
```

### Import Specific Modules

```javascript
// Components only
import { PluginLayout, Header, Footer } from "figma-plugin-utilities/components";

// Utilities only
import { sendToPlugin, createMessageHandler } from "figma-plugin-utilities/lib";
```

## Components

| Component | Description |
|-----------|-------------|
| `PluginLayout` | Main content wrapper with scrollable area |
| `Header` | Header bar with `left`, `center`, `right` slots and optional title |
| `Footer` | Footer with `right`, `split`, and `full` layout variants |
| `StatusBar` | Toast notifications with auto-dismiss (info/success/error/warning) |
| `EmptyState` | Empty/error states with optional icon and action buttons |
| `ListItem` | Selectable list items with metadata slot and action menu |
| `LoadingState` | Centered loading indicator with custom message |
| `FieldGroup` | Label + input wrapper for form fields |
| `CheckboxCard` | Large checkbox with card styling and better touch targets |

### Header

```svelte
<Header title="My Plugin">
  <svelte:fragment slot="left">
    <IconButton iconName={IconBack} on:click={goBack} />
  </svelte:fragment>
  <svelte:fragment slot="right">
    <IconButton iconName={IconSettings} />
  </svelte:fragment>
</Header>

<!-- Without border -->
<Header title="Settings" noBorder />
```

### Footer

```svelte
<!-- Right-aligned (default) -->
<Footer>
  <Button variant="primary">Save</Button>
</Footer>

<!-- Split layout -->
<Footer variant="split">
  <svelte:fragment slot="left">
    <Button variant="secondary">Cancel</Button>
  </svelte:fragment>
  <svelte:fragment slot="right">
    <Button variant="primary">Save</Button>
  </svelte:fragment>
</Footer>

<!-- Full-width buttons -->
<Footer variant="full">
  <Button variant="primary">Generate</Button>
</Footer>
```

### StatusBar

```svelte
<StatusBar 
  message={status.message} 
  type={status.type} 
  on:close={() => status = { message: '', type: 'info' }} 
/>
```

Types: `info`, `success`, `error`, `warning`. Auto-dismisses after 4s for `info` and `success`.

### EmptyState

```svelte
<EmptyState
  message="No items yet"
  icon="search"
  actions={[
    { label: "Add Item", handler: handleAdd },
    { label: "Import", handler: handleImport }
  ]}
/>
```

### ListItem

```svelte
<ListItem
  id="item-1"
  title="My Item"
  active={selectedId === 'item-1'}
  menuItems={[
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete' }
  ]}
  on:click={handleSelect}
  on:menuSelect={handleMenuAction}
>
  <span>Additional metadata</span>
</ListItem>
```

### CheckboxCard

Large checkbox with card-style background and better touch targets. 

```svelte
<!-- Basic usage -->
<CheckboxCard
  checked={isSelected}
  on:change={handleToggle}
>
  Small
</CheckboxCard>

<!-- With secondary text -->
<CheckboxCard
  checked={isSelected}
  on:change={handleToggle}
>
  Small
  <svelte:fragment slot="secondary">400px</svelte:fragment>
</CheckboxCard>

<!-- Disabled state -->
<CheckboxCard
  checked={true}
  disabled={true}
>
  Large
</CheckboxCard>
```

## Utilities

### Messages (`lib/messages.js`)

```javascript
// Send message to plugin code
sendToPlugin("my-action", { data: "value" });

// Handle messages from plugin
window.onmessage = createMessageHandler({
  success: (msg) => console.log("Success:", msg),
  error: (msg) => console.error("Error:", msg),
});
```

### Colors (`lib/colors.js`)

```javascript
// Convert between formats (Figma uses 0-1 range)
const rgb = hexToRgb("#FF0000"); // { r: 1, g: 0, b: 0 }
const hex = rgbToHex({ r: 1, g: 0, b: 0 }); // "#FF0000"

// Calculate contrast
const ratio = getContrastRatio(color1, color2);
const passes = meetsContrastLevel(ratio, "AA"); // true/false
```

### Validation (`lib/validation.js`)

```javascript
const urlResult = validateUrl("https://example.com");
// { valid: true } or { valid: false, error: "..." }

const jsonResult = validateJsonString('{"key": "value"}');
// { valid: true, parsed: {...} } or { valid: false, error: "..." }

const clean = sanitizeName("My Plugin!!!"); // "My Plugin"
```

### Error Handling (`lib/errorHandling.js`)

```javascript
// Safe async operations
const result = await safeAsync(
  () => fetch(url),
  "Loading data"
);
if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error.userMessage);
}

// Parse JSON safely
const parsed = parseJsonSafe(jsonString);
// { ok: true, value: {...} } or { ok: false, error: "..." }
```

### Figma Helpers (`lib/figma-helpers.ts`)

For use in `code.ts`:

```typescript
import { sendToUI, showError, focusNodes, loadFont } from "figma-plugin-utilities/lib/figma-helpers";

// Send message to UI
sendToUI("success", { message: "Done!" });

// Show notification
showError("Something went wrong");

// Focus viewport on nodes
focusNodes(figma.currentPage.selection);

// Load font before using
await loadFont("Inter", "Regular");

// Client storage
await saveToStorage("settings", { theme: "dark" });
const settings = await loadFromStorage("settings", { theme: "light" });
```
