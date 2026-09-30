// url=<UI3_FILE>?node-id=1027596-300
// source=src/components/DataTable.svelte
// component=DataTable
import figma from 'figma'
const instance = figma.selectedInstance

// One row. DataTable is data-driven, so inside a Data table the parent template
// collects rows from metadata; alone, it renders as a one-row DataTable.
const imports = ["import { DataTable } from 'figma-plugin-utilities'"]

const type = instance.getEnum('👥 Type', { 'Header': 'header', 'Row': 'row', 'Removed': 'removed' })
const selected = instance.getEnum('🐣 Selected', { 'False': false, 'True': true })
const action = instance.getBoolean('👁️ Action')
const nameLayer = instance.findText('Name')
const name = nameLayer && nameLayer.type === 'TEXT' ? nameLayer.textContent : ''
const key = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || 'row'

// No `path`: it finds nothing once this template runs nested in another. Cells,
// badges and the action are told apart by their Code Connect id instead.
const connected = instance.findConnectedInstances(() => true)
const cells = connected
  .filter((node) => node.codeConnectId() === 'data-table-cell')
  .map((cell) => cell.executeTemplate().metadata.props || {})

// Removed rows are red in code whatever their cells say.
const cellCode = cells.map((c) => (type === 'removed' ? c.fields.filter((f) => !f.startsWith('tone')) : c.fields))
  .map((fields) => `{ ${fields.join(', ')} }`)

const badges = connected
  .filter((node) => node.codeConnectId() === 'badge' && node.name !== 'Button icon')
  .map((badge) => {
    const [layer] = badge.findLayers((node) => node.type === 'TEXT')
    const text = layer && layer.type === 'TEXT' ? layer.textContent : ''
    const variant = badge.getEnum('👥 Variant', { 'Success': 'success', 'Warn': 'warning', 'Danger': 'danger', 'Brand': 'brand', 'Component': 'component' })
    return variant ? `{ text: ${JSON.stringify(text)}, variant: '${variant}' }` : `{ text: ${JSON.stringify(text)} }`
  })

const fields = [`key: '${key}'`, `name: ${JSON.stringify(name)}`, `cells: [${cellCode.join(', ')}]`]
if (type === 'removed') fields.push('removed: true')
if (badges.length) fields.push(`badges: [${badges.join(', ')}]`)
const row = `{ ${fields.join(', ')} }`
const columns = cells.map((c) => JSON.stringify(c.text))

export default {
  example: type === 'header'
    ? figma.code`<DataTable nameLabel="${name}" columns={[${columns.join(', ')}]} rows={rows} />`
    : figma.code`<DataTable columns={columns} rows={[${row}]}${action ? '' : ' selectable={false}'} />`,
  imports,
  id: 'data-table-row',
  metadata: {
    nestable: true,
    props: { imports, kind: 'data-table-row', type, key, name, selected, action, row, columns, activeIndex: cells.findIndex((c) => c.active) },
  },
}
