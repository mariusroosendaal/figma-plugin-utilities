// url=<UI3_FILE>?node-id=1027596-211
// source=src/components/DataTable.svelte
// component=DataTable
import figma from 'figma'
const instance = figma.selectedInstance

// One cell. DataTable is data-driven, so inside a Data table the parent template
// reads this cell's fields from metadata; alone, it renders as the Cell literal.
const imports = ["import { DataTable } from 'figma-plugin-utilities'"]

const type = instance.getEnum('👥 Type', { 'Header': 'header', 'Text': 'text', 'Badge': 'badge', 'Variable': 'variable' })
const active = instance.getEnum('🐣 Active', { 'False': false, 'True': true })

let text = ''
let tone = null
if (type === 'header' || type === 'text') text = instance.getString('🎛️ Value')
else {
  // The badge or chip is an exposed instance; its label is its first text layer.
  const inner = instance.findInstance(type === 'badge' ? 'Badge' : 'Variable')
  if (inner && inner.type === 'INSTANCE') {
    const [layer] = inner.findLayers((node) => node.type === 'TEXT')
    if (layer && layer.type === 'TEXT') text = layer.textContent
    if (type === 'badge') {
      tone = inner.getEnum('👥 Variant', { 'Success': 'new', 'Warn': 'changed', 'Danger': 'danger' }) || null
    }
  }
}

const fields = [`text: ${/^-?\d+(\.\d+)?$/.test(text) ? text : JSON.stringify(text)}`]
if (tone) fields.push(`tone: '${tone}'`)
if (type === 'text') fields.push('plain: true')
if (type === 'variable') fields.push(`alias: 'variable/name'`)

export default {
  example: type === 'header' ? figma.code`'${text}'` : figma.code`{ ${fields.join(', ')} }`,
  imports,
  id: 'data-table-cell',
  metadata: {
    nestable: true,
    props: { imports, kind: 'data-table-cell', type, text, tone, active, fields },
  },
}
