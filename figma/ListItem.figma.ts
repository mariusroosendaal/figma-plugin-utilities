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

const attrs = figma.code` id="${id}" title="${title}"${active ? ' active' : ''}${showMenu ? ' menuItems={menuItems}' : ''}${badgeCode ? ' hasBadge' : ''}`
const children = figma.code`${meta ? figma.code`
  ${meta}` : ''}${badgeCode ? figma.code`
  <svelte:fragment slot="badge">${badgeCode}</svelte:fragment>` : ''}`

export default {
  example: meta || badgeCode ? figma.code`<ListItem${attrs}>${children}
</ListItem>` : figma.code`<ListItem${attrs} />`,
  imports,
  id: 'list-item',
  metadata: { nestable: true, props: { imports } },
}
