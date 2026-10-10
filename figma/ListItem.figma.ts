// url=<UI3_FILE>?node-id=1027197-23952
// source=src/components/ListItem.svelte
// component=ListItem
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { ListItem } from 'figma-plugin-utilities'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}
// A nested child's code can span lines; indent each, not only the first.
const indented = (sections, indent) =>
  sections.map((s) =>
    s.type === 'CODE'
      ? { ...s, code: s.code.replace(/\n/g, `\n${indent}`) }
      : s.type === 'INSTANCE' && s.resultSections
        ? { ...s, resultSections: indented(s.resultSections, indent) }
        : s,
  )

const title = instance.getString('🎛️ Title')
const active = instance.getEnum('🐣 Active', { 'False': false, 'True': true })
const meta = instance.getBoolean('👁️ Meta') ? instance.getString('🎛️ Meta') : ''
const showMenu = instance.getBoolean('👁️ Menu')
const id = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || 'item'

let badgeCode
if (instance.getBoolean('👁️ Badge')) {
  const badge = instance.findInstance('Badge')
  if (badge && badge.type === 'INSTANCE') badgeCode = render(badge)
}

// The Actions slot's buttons. No `path`: it finds nothing once this template
// runs nested, so the item's own Menu and Badge are left out by name.
let actionsCode
if (instance.getBoolean('👁️ Actions slot')) {
  instance
    .findConnectedInstances((node) => node.name !== 'Menu' && node.name !== 'Badge')
    .forEach((child) => {
      const example = indented(render(child), '    ')
      actionsCode = actionsCode ? figma.code`${actionsCode}\n    ${example}` : example
    })
}

const attrs = figma.code` id="${id}" title="${title}"${active ? ' active' : ''}${showMenu ? ' menuItems={menuItems}' : ''}${badgeCode ? ' hasBadge' : ''}`
const children = figma.code`${meta ? figma.code`
  ${meta}` : ''}${badgeCode ? figma.code`
  {#snippet badge()}${badgeCode}{/snippet}` : ''}${actionsCode ? figma.code`
  {#snippet actions()}
    ${actionsCode}
  {/snippet}` : ''}`

export default {
  example: meta || badgeCode || actionsCode ? figma.code`<ListItem${attrs}>${children}
</ListItem>` : figma.code`<ListItem${attrs} />`,
  imports,
  id: 'list-item',
  metadata: { nestable: true, props: { imports } },
}
