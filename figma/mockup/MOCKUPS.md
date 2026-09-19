# Figma mockups from plugin code

Build a Figma mockup of a plugin UI from real UI3 components, starting from a `PluginUI.svelte` file or a description written in figma-ui3-kit-svelte / figma-plugin-utilities terms. The mockup uses the same components that Code Connect maps back to Svelte, so selecting it in Dev Mode (or calling `get_code_connect_map`) returns kit code.

## Before you start

- Load the `figma-use` skill; every build is a `use_figma` call.
- **Where to build**
  - **UI3 file** (`6dJFbL7SDC7kkS1fu3AHH6`), page **Mockups** (`1027190:25`). This is the default and needs no setup.
  - **Any other design file** with the UI3 library enabled. Components, styles and variables are imported by key. Icons need `options.icons` (see below).
- The builder is the `build-mockup.js` source at the end of this skill. It is about 28 KB, and `use_figma` accepts up to 50 KB, so keep the spec compact: build repeated parts with small helper functions rather than writing them out.

## Workflow

1. **Read the UI.** Open `PluginUI.svelte` (and any child components). Note the layout shell (`Header`, `PluginLayout`, `Footer`), each tab or view, and the state worth showing. Use default values. If a value is derived (lists, computed text), compute it from the plugin's own pure modules when that's cheap, e.g. `node -e 'import("./src/scale.ts").then(...)'`. Node 24 runs `.ts` directly.
2. **Write the spec** so it mirrors the Svelte tree:

   | Svelte | Spec |
   |---|---|
   | `<Button variant="secondary">Cancel</Button>` | `{ c: 'Button', props: { variant: 'secondary' }, children: 'Cancel' }` |
   | `<svelte:fragment slot="left">…` | `slots: { left: [ … ] }` |
   | Default slot content | `children: [ … ]` |
   | `<div>` with flex/column layout | `{ stack: 'v' \| 'h', gap, padding, align, justify, wrap, fill, stroke, strokeSides, radius, width, height, grow, fillHeight, children }` |
   | CSS grid with N columns | `{ grid: N, gap, children }` |
   | `<Text>` | `{ c: 'Text', props: { variant, color }, children: '…' }`. This is a connected component, so it round-trips. |
   | Plain text in custom markup | `{ text, variant: 'body-medium' \| 'body-small' \| 'body-large' (+ '-strong'), color: 'text' \| 'text-secondary' \| 'text-tertiary', width?, grow?, align?, truncate? }` |
   | `<Icon iconName={…}>` | `{ icon: 'icon.24.plus', color?: 'icon-tertiary' }` |
   | `<Chit color={…}>` | `{ c: 'Chit', props: { color: '#0D99FF' } }`. Connected, so it round-trips; use it for kit chits. |
   | A custom color swatch (not a kit Chit) | `{ swatch: '#0D99FF', size?: 16, radius?: 4 }` |
   | `<hr>` | `{ divider: true }` |
   | Plugin window | `{ window: 'Name — view', width: 320, height?, children: [Header, PluginLayout, Footer] }` |

   Build one window per tab or state. Build modals as standalone specs (`{ c: 'Modal', … }`). For a dialog that holds its own tabs and footer (`contentPadding={false}`), put a tabs row, a `fillHeight` stack and a `Footer` in its children.
3. **Run it.** Paste the builder, then the spec, and end with:
   ```js
   const result = await buildMockup(SPEC, { page: '1027190:25' })
   const root = await figma.getNodeByIdAsync(result.root)
   await root.screenshot({ scale: 1 })
   return result
   ```
   Rerunning a spec with the same `window` name replaces the previous build.
4. **Check it.** Compare the screenshot with the plugin and fix the spec, not the canvas.
5. **Round-trip (optional).** Call `get_code_connect_map` on the window node and compare the snippets with the source.

## Components

| Spec `c` | Props (kit names) | Slots |
|---|---|---|
| `Button` | `variant`, `size`, `disabled`/`ariaDisabled`, `iconName`, `iconLead`; label as `children` | |
| `IconButton` | `iconName`, `variant`, `disabled` | |
| `IconToggle` | `iconName`, `iconNameOn` (swaps icons; without it, one icon on the selected fill), `pressed`, `highlighted`, `variant`, `disabled` | |
| `SplitButton` | `iconName`, `size`, `disabled` | |
| `Input` | `value`, `placeholder`, `size`, `disabled`, `iconName` | |
| `Textarea` | `value`, `placeholder`, `disabled` | |
| `NumericInput` | `value`, `placeholder`, `label` (lead letter) or `iconName`, `unit`, `options` (adds the chevron), `disabled` | |
| `ColorInput` | `value` (hex), `opacity`, `variable`, `disabled` | |
| `Chit` | `color` (hex, `#RRGGBBAA` for alpha), `opacity`, `shape` | |
| `Dropdown` | `value` (`{ label }`), `placeholder`, `disabled`, `iconName` | |
| `Checkbox`, `Switch` | `checked`, `mixed`, `disabled`; label as `children` | |
| `Radio` | `group`, `value` (or `checked`), `disabled`; label as `children` | |
| `Tabs` | `tabs: [{ label }]` (max 5), `selectedTab` | |
| `SegmentedControl` | `value`, `disabled`; `children: [{ c: 'Segment', props: { value, iconName?, tooltip? }, children: 'Label' }]` (2–6) | |
| `Slider` | `value`, `min`, `max`, `variant` (`range`/`delta`/`stepper`), `disabled` | |
| `Badge` | `variant`, `strong`; text as `children` | |
| `Banner` | `variant`, `message` | |
| `Chip` | `label`, `variant`, `iconName`, `closable`, `focused`, `disabled` | |
| `Tooltip` | Renders its `children` (the trigger) only; pass `show: true` to draw the bubble | |
| `Menu` | `menuItems: [{ label, group?, section?, showHeading?, type?, checked?, selected?, iconName?, detail?, badge?, disabled?, subMenu? }]`, `itemVariant`, `showGroupLabels`, `searchable`, `searchPlaceholder`, `footerLabel` | |
| `Modal` | `title`, `width` (`small`/`medium`/`large` or pixels), `height` (pixels), `contentPadding`, `icon2`, `footerBorder` | `children`, `footer-left`, `footer-right`, `footer-full` |
| `Header` | `title`, `noBorder` | `left`, `center`, `right` |
| `Footer` | `variant` (`right`/`split`/`full`) | `children` (right/full), `left`, `right` (split) |
| `PluginLayout` | | `children` |
| `FieldGroup` | `label`, `size` | `children` (the control) |
| `EmptyState` | `message`, `size`, `icon`, `actions: [{ label }]` | |
| `LoadingState` | `message` | |
| `StatusBar` | `message`, `type` | |
| `ListItem` | `title`, `active`, `menuItems`, `hasBadge`; meta text as `children` | |
| `CheckboxCard` | `checked`, `disabled`, `secondary`; label as `children` | |
| `Text` | `variant` (`heading-*`, `body-*`, `-strong`), `color` (`--figma-color-text-secondary` / `-tertiary`); text as `children` | |
| `Label` | `size`; text as `children` | |
| `RadioGroup` | `legend` | `children` (Radios) |
| `Disclosure` | | `children` (DisclosureItems) |
| `DisclosureItem` | `title`, `open`, `section` | `children` (shown when `open`) |

`Input`, `Dropdown`, `FieldGroup`, `Banner` and the other block-level components fill the width of a vertical parent automatically. Anything else can take `fill: true`; in a horizontal parent, `grow: true` makes a component or stack take the remaining width (CSS `flex: 1` / `1fr`). `fillHeight: true` does the same vertically (e.g. an EmptyState centred in the panel), and stacks take a fixed `width`. `fill` and `stroke` on stacks take color variable names: `bg`, `bg-secondary`, `bg-brand`, `border`, `text`, `text-secondary`, `text-tertiary`, `icon-tertiary`.

## Icons

Use Figma icon names, which match the kit's SVG filenames: `iconName: 'icon.24.settings'`. A path such as `…/icons/24/icon.24.settings.svg` also works. Inside the UI3 file, icons are found by name. In any other file, pass their IDs and keys from `_packages/figma-ui3-kit-svelte/figma/icons.json`:

```js
await buildMockup(SPEC, { icons: { 'icon.24.settings': { id: '1:531125', key: '5c7c11ea23ba65e62cd7ab9871f2101c00ce41d1' } } })
```

## What doesn't round-trip

- **Plain layout.** Stacks, grids, dividers and `{ text }` primitives are plain Figma layers, so Code Connect lists only the components inside them. Use `{ c: 'Text' }` wherever the source uses `<Text>` so it does come back. Tables and custom markup won't appear in the generated code.
- **Runtime-only props.** `bind:`, event handlers, `type="number"`, ARIA props and ids have no Figma equivalent.
- **Dropdown selection.** A selected value reads back as `placeholder="…"`.
- **Tooltip.** It wraps a trigger in code, but in Figma it's hidden (the trigger renders alone).

## Example

A full round-trip example (the Spacing Sets Scale tab) is in `figma-plugin-utilities/figma/mockup/examples/spacing-sets.js`. A minimal spec:

```js
const SPEC = {
  window: 'Rename layers',
  children: [
    { c: 'Header', props: { title: 'Rename layers' } },
    { c: 'PluginLayout', children: [
      { c: 'FieldGroup', props: { label: 'Prefix' }, children: [{ c: 'Input', props: { value: 'icon/' } }] },
      { c: 'CheckboxCard', props: { checked: true, secondary: '24 layers' }, children: 'Include hidden layers' },
    ] },
    { c: 'Footer', props: { variant: 'split' }, slots: {
      left: [{ c: 'Button', props: { variant: 'secondary' }, children: 'Cancel' }],
      right: [{ c: 'Button', children: 'Rename layers' }],
    } },
  ],
}
```
