# figma-plugin-utilities

Shared Svelte components and utilities for Figma plugins.

## Installation

```bash
npm install figma-plugin-utilities figma-ui3-kit-svelte
```

The components are built from `figma-ui3-kit-svelte`, a peer dependency: install it beside the utilities.

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
  Section,
  DataTable,
  FieldGrid,
  SteppedField,
  LadderBadges,
  CodeExportModal,
  RampCurve,
  MappingChip,
  // Messages
  sendToPlugin,
  createMessageHandler,
  // Colors
  rgbToHex,
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsContrastLevel,
  // Validation
  validateUrl,
  validateJsonString,
  validateEmail,
  validateNumber,
  sanitizeName,
  sanitizeInput,
  isEmpty,
  // Error handling
  safeAsync,
  parseJsonSafe,
  // Resize
  setDefaultWidth,
  getContentHeight,
  resizeToFit,
  autoResize,
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
| `Header` | Header bar with `left`, `center`, `right` snippets and optional title |
| `Footer` | Footer with `right`, `split`, and `full` layout variants |
| `StatusBar` | Toast notifications with auto-dismiss (info/success/error/warning) |
| `EmptyState` | Empty/error states with optional icon and action buttons; `size`, `iconSize`, `centered`, and `role="alert"` for failures |
| `ListItem` | Selectable list items with metadata and a `badge` snippet, an action menu (`menuOpen`, `onmenutoggle`, `onmenuclose`) |
| `LoadingState` | Centered message as `role="status"` (text only, no spinner) |
| `FieldGroup` | Label + input wrapper; `labelFor` binds the label to a text control, `hint` adds a line under it |
| `CheckboxCard` | Large checkbox with card styling and better touch targets; `change` event |
| `Section` | Titled group of fields as in Figma's panels: a `Header` with the title and an `actions` snippet, content padded by the section itself |
| `DataTable` | Named rows with a cell per column (a set at each breakpoint, a style before and after): columns with their own width and alignment, a read-only mode with table roles, row selection with an `editor` snippet, notes as badges, with tooltips, and a `+N` count past two, an `action` snippet, values as badges or variable chips, removed rows and a marked column |
| `FieldGrid` | Fields side by side in equal columns (`columns`, default 2) that shrink below their content |
| `SteppedField` | A field with − and + icon buttons after it, as one grid cell; `step` event with -1 or 1 |
| `LadderBadges` | A scale's sizes as badges, outlined where used and archived where not, each with the caller's tooltip |
| `RampCurve` | A ramp's Bézier at the breakpoint shown, in the caller's units: handles for the ends and the bend at the smallest and largest breakpoint, blends between; `change` and `select` events |
| `MappingChip` | One side of a source → target row: a filled 24px chip with a lead icon or chit, a truncating label, a `preview` after a dot and a trailing `count`; `click` event |
| `CodeExportModal` | Read-only code in a modal with a copy button that reads "Copied" for 2s; a `controls` snippet above the code |

Every component also takes a `class` (or `className`) prop.

### Header

```svelte
<Header title="My Plugin">
  {#snippet left()}
    <IconButton iconName={IconBack} onclick={goBack} />
  {/snippet}
  {#snippet right()}
    <IconButton iconName={IconSettings} />
  {/snippet}
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
  {#snippet left()}
    <Button variant="secondary">Cancel</Button>
  {/snippet}
  {#snippet right()}
    <Button variant="primary">Save</Button>
  {/snippet}
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
  onclose={() => status = { message: '', type: 'info' }} 
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
  onclick={handleSelect}
  onmenuselect={handleMenuAction}
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
  onchange={handleToggle}
>
  Small
</CheckboxCard>

<!-- With secondary text -->
<CheckboxCard
  checked={isSelected}
  onchange={handleToggle}
>
  Small
  {#snippet secondary()}400px{/snippet}
</CheckboxCard>

<!-- Disabled state -->
<CheckboxCard
  checked={true}
  disabled={true}
>
  Large
</CheckboxCard>
```

### FieldGrid

```svelte
<FieldGrid columns={3}>
  <FieldGroup label="Base">…</FieldGroup>
  <FieldGroup label="Ratio">…</FieldGroup>
  <FieldGroup label="Steps">…</FieldGroup>
</FieldGrid>
```

### SteppedField

```svelte
<SteppedField
  downLabel="Step {set.name} down"
  upLabel="Step {set.name} up"
  onstep={(step) => setOffset(set.offset + step)}
>
  <FieldGroup label="Steps off the curve" labelFor="offset" size="small">
    <NumericInput id="offset" value={set.offset} precision={0} />
  </FieldGroup>
</SteppedField>
```

### LadderBadges

```svelte
<LadderBadges
  ariaLabel="Ladder sizes"
  badges={ladder.map((value, i) => ({
    value,
    used: used.has(i),
    title: used.has(i) ? "Used by a style" : "Unused",
  }))}
/>
```

Each badge's accessible name is `"{value}px, used"` or `"{value}px, unused"`.

### MappingChip

```svelte
<MappingChip
  label={row.sourceName}
  count={row.uses}
  tone="secondary"
  title="Select these icons"
  onclick={() => reveal(row)}
/>
```

`iconName` or `chit` (which wins) adds a lead that hangs into the padding; `preview` follows the label as "label · preview"; `tone` is `default`, `secondary` or `component`; `selected` draws the selection border. The `lead` snippet takes a marker ahead of the lead, and `element` binds the button.

### RampCurve

```svelte
<RampCurve
  {ramp}
  curves={breakpoints.map((_, b) => rampAt(ramp, b))}
  span={[lo, hi]}
  grid={ladder.map((size, rung) => ({ key: rung, y: size, label: size }))}
  dots={levels.map((size, k) => ({ key: k, x: k / (levels.length - 1), y: size }))}
  {breakpoints}
  {selected}
  rungCount={ladder.length}
  rungAt={(px) => nearestRung(ladder, px)}
  format={(px) => `${Math.round(px)}px`}
  ariaLabel="Heading ramp"
  bottomLabel="Smallest level"
  topLabel="Largest level"
  along="levels"
  onchange={(patch) => (ramp = { ...ramp, ...patch })}
  onselect={(index) => (selected = index)}
/>
```

`ramp` holds the ends as rungs and the bends at each end (`bottomSm`, `topSm`, `bendSm`, `bottomLg`, `topLg`, `bendLg`) and `bendPosition`; `change` patches those keys. Everything else on the y axis is in the caller's units.

### CodeExportModal

```svelte
<CodeExportModal
  isOpen={exportOpen}
  title="Export CSS"
  value={css}
  ariaLabel="Exported CSS"
  copyLabel="Copy CSS"
  onclose={() => (exportOpen = false)}
>
  {#snippet controls()}
    <SegmentedControl …/>
  {/snippet}
</CodeExportModal>
```

Copies with `execCommand`, since the plugin iframe isn't granted clipboard-write. `position` (default `"bottom"`), `width` (`"medium"`) and `height` (`"auto"`) pass through to `Modal`.

## Utilities

### Messages (`lib/messages.ts`)

```javascript
// Send message to plugin code
sendToPlugin("my-action", { data: "value" });

// Handle messages from plugin
window.onmessage = createMessageHandler({
  success: (msg) => console.log("Success:", msg),
  error: (msg) => console.error("Error:", msg),
});
```

In TypeScript, type the messages as one union per direction, and the helpers check each message's name and data:

```ts
// messages.ts
export type ToPlugin = { type: "run"; options: Options } | { type: "cancel" };
export type ToUI = { type: "done"; count: number };

// PluginUI.svelte
import { sendToPlugin, createMessageHandler, type Send } from "figma-plugin-utilities";
const send: Send<ToPlugin> = sendToPlugin;
send("run", { options }); // the data is required, since `run` has it
window.onmessage = createMessageHandler<ToUI>({ done: (msg) => (count = msg.count) });

// code.ts
import { sendToUI } from "figma-plugin-utilities/lib/figma-helpers";
import type { Send } from "figma-plugin-utilities/lib/messages";
const send: Send<ToUI> = sendToUI;
figma.ui.onmessage = (msg: ToPlugin) => { /* … */ };
```

### Colors (`lib/colors.ts`)

```javascript
// Convert between formats (Figma uses 0-1 range)
const rgb = hexToRgb("#FF0000"); // { r: 1, g: 0, b: 0 }
const hex = rgbToHex({ r: 1, g: 0, b: 0 }); // "#FF0000"

// Contrast utilities
const luminance = getLuminance({ r: 1, g: 0, b: 0 });
const ratio = getContrastRatio(color1, color2);
const passes = meetsContrastLevel(ratio, "AA"); // true/false
```

### Validation (`lib/validation.ts`)

```javascript
const urlResult = validateUrl("https://example.com");
// { valid: true } or { valid: false, error: "..." }

const jsonResult = validateJsonString('{"key": "value"}');
// { valid: true, parsed: {...} } or { valid: false, error: "..." }

validateEmail("user@example.com"); // { valid: true }
validateNumber("42", { min: 0, max: 100, integer: true }); // { valid: true, value: 42 }
validateUrl("", { required: false }); // { valid: true } — empty is allowed
validateJsonString(text, { maxSizeKB: 512, requireObject: true });

const clean = sanitizeName("My Plugin!!!", 200); // "My Plugin" — "Untitled" if nothing survives
sanitizeInput(input, 50); // stringify, truncate to maxLength, strip control characters, trim
// Note: sanitizeInput does NOT escape HTML. Escape at the point of rendering instead.
isEmpty(""); // true — also for [] and {}
```

### Error Handling (`lib/errorHandling.ts`)

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

### Resize (`lib/resize.ts`)

Utilities for dynamically resizing the plugin window to fit its content.

```javascript
// One-time resize to fit content: measure a naturally-flowing wrapper, not document.body
resizeToFit({ container: myContainerEl, width: 300, minHeight: 100, maxHeight: 600 });

// Watch for content changes and auto-resize
const cleanup = autoResize({
  container: myContainerEl, // bind:this on a naturally-flowing wrapper
  width: 300,
  minHeight: 100,
  maxHeight: 600,
});

// Call cleanup when the component is destroyed
onDestroy(cleanup);

// Set default width used across all resize calls
setDefaultWidth(320);
```

> **Note:** The `container` element passed to `autoResize` must **not** have `height: 100%` or a fixed height — it should flow naturally with its content so `scrollHeight` can be measured accurately.

### Spec Frame Builders (`lib/figma-frame-builders.ts`)

Typed builders for canvas frames in a spec or documentation generator — auto-layout frames and components, text, token chips, color swatches, table cells and headers, with light and dark palettes.

```typescript
import {
  specTokens, loadSpecFonts,
  createAutoLayoutFrame, createAutoLayoutComponent, createText,
  createTokenChip, createColorSwatch, createTableCell, createTableHeader,
} from "figma-plugin-utilities/lib/figma-frame-builders";

await loadSpecFonts(); // once, before drawing
const theme = specTokens.themes.dark;

const row = createAutoLayoutFrame({ name: "row", direction: "HORIZONTAL", spacing: 8, fill: theme.cellFill });
row.appendChild(createTokenChip({ label: "#FFFFFF", background: theme.chipBg, textColor: theme.text }));
```

`specTokens` carries `accentColors`, `fonts` and `themes` (`light`, `dark`). Builders that can return either node take `as: "component"` for a `ComponentNode` instead of a `FrameNode`. Exported types: `PaddingSpec`, `SpecTheme`, `NodeKind`, `NodeFor`.

### Scale Math (`lib/scale.ts`)

Pure math for scales shaped across breakpoints — the ramp's quadratic Bézier (`bezier`, `clampPosition`, `levelT`), blending by viewport width (`blendAt`), values between breakpoints (`valueAtWidth`), fallback widths (`FALLBACK_WIDTHS`, `isBreakpointName`, `widthsFor`) and fluid CSS (`fluidClamp`, `trimNumber`), plus `lerp` and `roundHalfDown`. No Figma API: both threads may import it, provided the plugin builds each thread separately.

```typescript
import { widthsFor, blendAt, fluidClamp } from "figma-plugin-utilities/lib/scale";
```

### Figma Helpers (`lib/figma-helpers.ts`)

For use in `code.ts`:

```typescript
import {
  sendToUI,
  showError,
  showSuccess,
  focusNodes,
  loadFont,
  setText,
  createSettingsStore,
  handleResize,
} from "figma-plugin-utilities/lib/figma-helpers";

// Send message to UI
sendToUI("success", { message: "Done!" });

// Show notifications
showError("Something went wrong");
showSuccess("Created!");

// Focus viewport on nodes
focusNodes(figma.currentPage.selection);

// Load a font before using it (once per run)
await loadFont("Inter", "Regular");

// Set a text layer's characters in its own fonts
await setText(textNode, "Hello");

// Settings in client storage, cleaned on load and on save
const store = createSettingsStore("settings", (raw) => ({
  theme: (raw as { theme?: string })?.theme === "dark" ? "dark" : "light",
}));
const settings = await store.load();
await store.save({ ...settings, theme: "dark" });

// Handle resize message from UI (call in your message handler)
if (msg.type === "resize") handleResize(msg);
```
