// url=<UI3_FILE>?node-id=1027197-23952
// source=src/components/ListItem.svelte
// component=ListItem
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('🎛️ Title')
const active = instance.getEnum('🐣 Active', { 'False': false, 'True': true })
const meta = instance.getBoolean('👁️ Meta') ? instance.getString('🎛️ Meta') : ''
const showMenu = instance.getBoolean('👁️ Menu')
const id = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || 'item'

let badgeCode
if (instance.getBoolean('👁️ Badge')) {
  const badge = instance.findInstance('Badge')
  if (badge && badge.type === 'INSTANCE') badgeCode = badge.executeTemplate().example
}

const attrs = figma.code` id="${id}" title="${title}"${active ? ' active' : ''}${showMenu ? ' menuItems={menuItems}' : ''}${badgeCode ? ' hasBadge' : ''}`
const children = figma.code`${meta ? figma.code`
  ${meta}` : ''}${badgeCode ? figma.code`
  <svelte:fragment slot="badge">${badgeCode}</svelte:fragment>` : ''}`

export default {
  example: meta || badgeCode ? figma.code`<ListItem${attrs}>${children}
</ListItem>` : figma.code`<ListItem${attrs} />`,
  imports: ["import { ListItem } from 'figma-plugin-utilities'"],
  id: 'list-item',
  metadata: { nestable: true },
}
