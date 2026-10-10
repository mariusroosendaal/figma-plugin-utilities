# Figma mockups from plugin code

Build a Figma mockup of a plugin UI from real UI3 components, starting from a `PluginUI.svelte` file or a description written in figma-ui3-kit-svelte / figma-plugin-utilities terms. The mockup uses the same components that Code Connect maps back to Svelte, so selecting it in Dev Mode (or calling `get_code_connect_map`) returns kit code.

## Before you start

- Load the `figma-use` skill; every build is a `use_figma` call.
- **Where to build**
  - **UI3 file** (`6dJFbL7SDC7kkS1fu3AHH6`), page **Mockups** (`1027190:25`). This is the default and needs no setup.
  - **Any other design file**, with access to the UI3 library. Components, styles and variables are imported by key. Icons need `options.icons` (see below).
- The builder is the `build-mockup.js` source at the end of this skill, minified. It is about 44 KB, and `use_figma` accepts 50,000 characters in all, so keep the spec under about 6 KB: build repeated parts with small helper functions rather than writing them out, and split a large screen into several windows.

## Workflow

1. **Read the UI.** Open `PluginUI.svelte` (and any child components). Note the layout shell (`Header`, `PluginLayout`, `Footer`), each tab or view, and the state worth showing. Use default values. If a value is derived (lists, computed text), compute it from the plugin's own pure modules when that's cheap, e.g. `node -e 'import("./src/scale.ts").then(...)'`. Node 24 runs `.ts` directly.
2. **Write the spec** so it mirrors the Svelte tree:

   | Svelte | Spec |
   |---|---|
   | `<Button variant="secondary">Cancel</Button>` | `{ c: 'Button', props: { variant: 'secondary' }, children: 'Cancel' }` |
   | `{#snippet left()}…{/snippet}` | `slots: { left: [ … ] }` |
   | Children (content not in a snippet) | `children: [ … ]` |
   | `<div>` with flex/column layout | `{ stack: 'v' \| 'h', gap, padding, align, justify, wrap, fill, stroke, strokeSides (`['top']` or `['bottom']`), radius, width, height, grow, fillHeight, children }` |
   | CSS grid with N columns | `{ grid: N, gap, children }` |
   | `<Text>` | `{ c: 'Text', props: { variant, color }, children: '…' }`. This is a connected component, so it round-trips. |
   | Plain text in custom markup | `{ text, variant: 'body-medium' \| 'body-small' \| 'body-large' (+ '-strong'), color: 'text' \| 'text-secondary' \| 'text-tertiary', width?, grow?, align?, truncate? }` |
   | `<Icon iconName={…}>` | `{ icon: 'icon.24.plus', color?: 'icon-tertiary' }`; `color` also takes `icon-secondary`, `icon-brand`, `icon-warning`, `icon-danger` |
   | `<Chit color={…}>` | `{ c: 'Chit', props: { color: '#0D99FF' } }`. Connected, so it round-trips; use it for kit chits. |
   | A custom color swatch (not a kit Chit) | `{ swatch: '#0D99FF', size?: 16, radius?: 4 }` |
   | `<hr>` | `{ divider: true }` |
   | Plugin window | `{ window: 'Name — view', width: 320, height?, title?, icon?, chrome?, elevation?, children: [Header, PluginLayout, Footer] }` |

   A window opens with Figma's title bar, the kit's **Plugin window header**: the plugin's icon, its name and a close button, as Figma draws them above every plugin UI. The name is the window's up to ` — `, or `title`. The bar's **Icon slot** holds a placeholder until you pass the plugin's own icon as SVG markup in `icon`: if the plugin has `assets/icon.svg`, paste its contents in as a string (about 1 KB). `chrome: false` leaves the bar out. `width` and `height` are the plugin's own, as passed to `figma.showUI`, so the window is 40px taller than `height` with the bar. Without `height`, the window hugs its content. The bar isn't kit code, so it has no Code Connect and doesn't round-trip. The window has UI3's elevation 400 effect style, `light/elevation-400-menu-panel` or `dark/elevation-400-menu-panel`, whichever matches the theme the page or frame it's built in resolves to; `elevation: false` leaves it out.

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
| `ToggleButton` | `pressed`, `iconName` (lead), `badge` (a count); label as `children` or `label` | |
| `Input` | `value`, `placeholder`, `size`, `disabled`, `iconName` | |
| `Textarea` | `value`, `placeholder`, `disabled` | |
| `NumericInput` | `value`, `placeholder`, `label` (lead letter) or `iconName`, `unit`, `options` (adds the chevron), `variable` (a bound variable's pill), `disabled` | |
| `NumericInputMulti` | `values`, `iconName`, `disabled` (flag or per cell) | |
| `Tree` | `nodes`, `mode`, `expanded`, `selected`, `checked` (three levels of indent) | |
| `ColorInput` | `value` (hex), `opacity`, `variable`, `disabled` | |
| `Chit` | `color` (hex, `#RRGGBBAA` for alpha), `opacity`, `shape` | |
| `Dropdown` | `value` (`{ label, chit?, iconName? }`), `label`, `placeholder`, `disabled`, `iconName`, `size`, `stroke`, `chit` (hex), `badge` (text, `{ text, variant?, strong? }` or a list), `badgeVariant`. A badge or a chit draws the Kit additions Dropdown badge, which shows the first badge only and has no `disabled`, `size` or `stroke` | |
| `Checkbox`, `Switch` | `checked`, `mixed`, `disabled`, `description`; label as `children` | |
| `Radio` | `group`, `value` (or `checked`), `disabled`, `variant` (`button`); label as `children` | |
| `Tabs` | `tabs: [{ label, badge?, unread? }]` (max 5; `unread` takes the count blue), `selectedTab` | |
| `SegmentedControl` | `value`, `disabled`; `children: [{ c: 'Segment', props: { value, iconName?, tooltip? }, children: 'Label' }]` (2–6) | |
| `Slider` | `value`, `min`, `max`, `variant` (`range`/`delta`/`stepper`/`hue`/`opacity`), `defaultValue` (range: the marker), `disabled` | |
| `Badge` | `variant` (incl. `count`/`count-inactive`), `strong`, `size`, `dot`; text as `children` | |
| `Avatar` | `name`, `color`, `src`, `size`, `shape`, `count`, `unread`, `disabled` | |
| `VariablePill` | `label`, `selected`, `onSelected`, `muted`, `disabled` | |
| `Banner` | `variant`, `message` | |
| `Chip` | `label`, `variant`, `iconName`, `closable`, `focused`, `disabled` | |
| `Dropzone` | `buttonLabel`, `hint`, `iconName` (`null` for none), `compact`, `disabled`, `invalid` with `errorMessage`, `dragging` (the drag-over look). Takes `fillHeight` | |
| `Tooltip` | Renders its `children` (the trigger) only; pass `show: true` to draw the bubble | |
| `Menu` | `menuItems: [{ label, group?, section?, showHeading?, type?, checked?, selected?, iconName?, detail?, badge?, disabled?, subMenu? }]`, `itemVariant`, `showGroupLabels`, `searchable`, `searchPlaceholder`, `footerLabel`, `footerVariant`; items also take `avatar` | |
| `Modal` | `title`, `width` (`small`/`medium`/`large` or pixels), `height` (pixels), `contentPadding`, `icon2`, `icon2Name` (its icon), `footerBorder`. The Kit additions Modal has one header, so `headerVariant` draws as a title | `children`, `footerLeft`, `footerRight`, `footerFull` |
| `Header` | `title`, `noBorder` | `left`, `center`, `right` |
| `Footer` | `variant` (`right`/`split`/`full`). Text first in `left` or last in `right` sits 16px from the edge, as in code | `children` (right/full), `left`, `right` (split) |
| `PluginLayout` | | `children` |
| `FieldGroup` | `label`, `size`, `hint` | `children` (the control) |
| `EmptyState` | `message`, `size`, `icon`, `actions: [{ label }]` | |
| `LoadingState` | `message` | |
| `StatusBar` | `message`, `type` | |
| `ListItem` | `title`, `active`, `menuItems`, `hasBadge`; meta text as `children` | `actions` (buttons inside the item, after its text) |
| `SidebarRow` | `meta`, `title`, `detail`, `message` (or `children`), `link`, `unread`, `selected`, `hover` (the Hover state, which shows the actions); `lines` isn't drawn | `lead` (Avatars by `name` and `color`, `disabled` for UI3's gray read ones, or `{ icon, color }`: two with a `link`, one without), `actions` (IconButtons or `{ icon }`, up to two) |
| `CheckboxCard` | `checked`, `disabled`, `secondary`; label as `children` | |
| `Section` | `title` | `children` (the fields), `actions` (icon buttons) |
| `FieldGrid` | `columns` (2–5) | `children` (the fields) |
| `SteppedField` | | `children` (the field) |
| `LadderBadges` | `badges: [{ value, used }]` | |
| `MappingChip` | `label`, `preview`, `count`, `iconName` or `chit`, `tone`, `selected`, `disabled` | |
| `DataTable` | `columns` (labels, or `{ label, width }` in rem), `rows: [{ key, name, cells, removed?, badges? }]` (cells as DataTable takes them, or bare values), `nameLabel`, `selectable`, `selectedKey`, `active`, `maxBadges`, `inset` (px, as the code's `inset`; the table then sits at the container's edge) | `action` (every row), `editor` (under the `selectedKey` row) |
| `RampCurve` | `breakpoints`, `selected`. The chart is the component's sample drawing; the ramp data isn't drawn | |
| `CodeExportModal` | `title`, `value`, `copyLabel` | `controls` (above the code) |
| `Text` | `variant` (`heading-*`, `body-*`, `-strong`), `color` (`--figma-color-text-secondary` / `-tertiary`); text as `children` | |
| `Label` | `size`; text as `children` | |
| `RadioGroup` | `legend`, `direction` | `children` (Radios) |
| `Disclosure` | | `children` (DisclosureItems) |
| `DisclosureItem` | `title`, `open`, `section` | `children` (shown when `open`) |

`Input`, `Dropdown`, `FieldGroup`, `Banner`, `Dropzone` and the other block-level components fill the width of a vertical parent automatically. Anything else can take `fill: true`; in a horizontal parent, `grow: true` makes a component or stack take the remaining width (CSS `flex: 1` / `1fr`). `fillHeight: true` does the same vertically (e.g. an EmptyState centered in the panel), and stacks take a fixed `width`. `fill` and `stroke` on stacks take color variable names: `bg`, `bg-secondary`, `bg-brand`, `border`, `text`, `text-secondary`, `text-tertiary`, `icon-tertiary`.

## Icons

Use Figma icon names, which match the kit's SVG filenames: `iconName: 'icon.24.settings'`. A path such as `…/icons/24/icon.24.settings.svg` also works. Inside the UI3 file, icons are found by name. In any other file, pass their IDs and keys from `_packages/figma-ui3-kit-svelte/figma/icons.json`:

```js
await buildMockup(SPEC, { icons: { 'icon.24.settings': { id: '1:531125', key: '5c7c11ea23ba65e62cd7ab9871f2101c00ce41d1' } } })
```

## What doesn't round-trip

- **Plain layout.** Stacks, grids, dividers and `{ text }` primitives are plain Figma layers, so Code Connect lists only the components inside them. Use `{ c: 'Text' }` wherever the source uses `<Text>` so it does come back. Custom markup won't appear in the generated code; use `DataTable` for tables.
- **Runtime-only props.** `bind:`, event handlers, `type="number"`, ARIA props and ids have no Figma equivalent.
- **Dropdown selection.** A selected value reads back as `placeholder="…"`.
- **Tooltip.** It wraps a trigger in code, but in Figma it's hidden (the trigger renders alone).

## Example

A full example (the Scale tab of Spacing Sets, a plugin since rolled into Vitrine Tools) is in `figma-plugin-utilities/figma/mockup/examples/spacing-sets.js`. A minimal spec:

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
