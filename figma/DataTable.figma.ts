// url=<UI3_FILE>?node-id=1027596-301
// source=src/components/DataTable.svelte
// component=DataTable
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { DataTable } from 'figma-plugin-utilities'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

// DataTable is data-driven: the header row gives the columns, each other row
// one entry in rows. Anything else in the Rows slot is the open row's editor.
// No `path`: it finds nothing once this template runs nested in another.
const items = instance.findConnectedInstances(() => true)
const rows = []
const others = []
items.forEach((item) => {
  const result = item.executeTemplate()
  const props = result.metadata && result.metadata.props
  if (props && props.kind === 'data-table-row') rows.push(props)
  else others.push(item)
})

const header = rows.find((r) => r.type === 'header')
const body = rows.filter((r) => r.type !== 'header')
const selectable = body.some((r) => r.action)
const selected = body.find((r) => r.selected && r.type !== 'removed')
const activeIndex = header ? header.activeIndex : -1

let editor
others.forEach((item) => {
  const example = render(item)
  editor = editor ? figma.code`${editor}\n    ${example}` : example
})

const attrs = [
  header && header.name !== 'Name' ? ` nameLabel="${header.name}"` : '',
  ` columns={[${header ? header.columns.join(', ') : ''}]}`,
  selectable ? '' : ' selectable={false}',
  selectable && selected ? ` selectedKey="${selected.key}"` : '',
  activeIndex >= 0 ? ` active={${activeIndex}}` : '',
].join('')

const rowsCode = `rows={[\n${body.map((r) => `    ${r.row},`).join('\n')}\n  ]}`

export default {
  example: editor
    ? figma.code`<DataTable${attrs}
  ${rowsCode}
>
  <svelte:fragment slot="editor" let:row>
    ${editor}
  </svelte:fragment>
</DataTable>`
    : figma.code`<DataTable${attrs}
  ${rowsCode}
/>`,
  imports,
  id: 'data-table',
  metadata: { nestable: true, props: { imports } },
}
