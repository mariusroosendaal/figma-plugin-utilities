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

## Mockups

`mockup/` builds Figma mockups of plugin UIs from these components — see `mockup/MOCKUPS.md`. It is synced into the `figma-plugin-kit:mockup` skill by `npm run sync-skills`.
