// url=<UI3_FILE>?node-id=1027602-534
// source=src/components/FieldGrid.svelte
// component=FieldGrid
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { FieldGrid } from 'figma-plugin-utilities'"]
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

// Render the slot's connected children inline. getSlot() alone makes Dev Mode emit
// React helper functions, so it's only the fallback for unconnected content.
// No `path`: it finds nothing once this template runs nested in another.
// The fields are the only connected layers.
function slot(name, indent) {
  const children = instance.findConnectedInstances(() => true)
  if (!children.length) return instance.getSlot(name)
  let code
  children.forEach((child) => {
    const example = indented(render(child), indent)
    code = code ? figma.code`${code}\n${indent}${example}` : example
  })
  return code
}

const columns = instance.getEnum('👥 Columns', { '2': 2, '3': 3, '4': 4, '5': 5 })
const fields = slot('Fields slot', '  ')

export default {
  example: figma.code`<FieldGrid${columns !== 2 ? figma.code` columns={${columns}}` : ''}>
  ${fields}
</FieldGrid>`,
  imports,
  id: 'field-grid',
  metadata: { nestable: true, props: { imports } },
}
