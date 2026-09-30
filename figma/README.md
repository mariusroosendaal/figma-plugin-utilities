# Figma ↔ code

Code Connect templates for the plugin utilities components, which live in the UI3 Figma file (`<UI3_FILE>` in `../figma.config.json`) on the **Plugin layout**, **Plugin states** and **Plugin fields & lists** pages. They're built from UI3 components and variables, and use native Figma slots where the Svelte component has a `<slot>`. Slot content is rendered inline from each child's own template (`getSlot()` alone makes Dev Mode emit React helper functions), and imports bubble up through `metadata.props.imports` — see the kit's `figma/README.md`.

```bash
npm run figma:parse     # validate templates locally
npm run figma:publish   # publish (reads FIGMA_ACCESS_TOKEN from .env)
```

| Component | Node | Notes |
|---|---|---|
| Plugin layout | `1027197:23801` | `Content slot` → default slot. |
| Plugin header | `1027197:23734` | `🎛️ Title`, `👁️ Border` ↔ `noBorder`. Left/center slots are toggled with `👁️ Left slot` / `👁️ Center slot` so empty fragments aren't emitted. |
| Plugin footer | `1027197:23800` | Right/Full use `Actions slot`; Split uses `Left slot` + `Right slot`. |
| Field group | `1027197:23913` | `Control slot` holds the control; Small ↔ `size="small"`. |
| Empty state | `1027197:23851` | Buttons in `Actions slot` become `actions={[{ label, handler }]}`. |
| Loading state | `1027197:23852` | `🎛️ Message`. |
| Status bar | `1027197:23902` | `👥 Type` ↔ `type`. |
| List item | `1027197:23952` | `id` is derived from the title; `👁️ Menu` → `menuItems={menuItems}`. |
| Checkbox card | `1027197:24237` | Checked state and label come from the exposed Checkbox instance. |
| Section | `1027600:38` | Title and `actions` come from the exposed Plugin header (its Right slot); `Content slot` → default slot. |
| Code export modal | `1027600:85` | Read off the exposed kit Modal: title, width, the copy button's label → `copyLabel`, other content above the Textarea → `controls`. The code itself stays `value={code}`. |
| Field grid | `1027602:534` | `👥 Columns` 2–5 ↔ `columns`. Fields fill the row with a minimum width that wraps the rest. |
| Stepped field | `1027596:474` | `Field slot` → default slot; the button labels are named after the field's label. |
| Ladder badges | `1027596:502` | Badges in the slot → `badges`; Archived ↔ `used: false`. |
| Mapping chip | `1027594:377` | `🎛️ Lead` Icon/Chit ↔ `iconName`/`chit` (the chit's color stays a placeholder), `👥 Tone`, `🐣 State` Selected/Disabled. |
| Data table | `1027596:301` | Data-driven: the header row gives `nameLabel` and `columns`, other rows `rows`, with `selectedKey`, `active` and `selectable`. Anything else in `Rows slot` → the `editor` slot. |
| Data table row, cell | `1027596:300`, `1027596:211` | Report their fields to Data table through metadata. A cell's badge variant is its tone (Success new, Warn changed, Danger danger); Text ↔ `plain`; Variable ↔ `alias`. |
| Ramp curve | `1027599:473` | Only the breakpoint shown and whether it's editable; the ramp data stays variables. |

The templates run nested inside other templates (a Field grid in a Section, say), where `findConnectedInstances` with a `path` finds nothing. They find connected layers without one and tell them apart by name or Code Connect id.

## Mockups

`mockup/` builds Figma mockups of plugin UIs from these components — see `mockup/MOCKUPS.md`. It is synced into the `figma-plugin-kit:mockup` skill by `npm run sync-skills`.
