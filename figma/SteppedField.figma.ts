// url=<UI3_FILE>?node-id=1027596-474
// source=src/components/SteppedField.svelte
// component=SteppedField
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { SteppedField } from 'figma-plugin-utilities'"]
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
// The − and + buttons are connected too, so they're left out by name.
const isField = (node) => node.name !== 'Step down' && node.name !== 'Step up'
function slot(name, indent) {
  const children = instance.findConnectedInstances(isField)
  if (!children.length) return instance.getSlot(name)
  let code
  children.forEach((child) => {
    const example = indented(render(child), indent)
    code = code ? figma.code`${code}\n${indent}${example}` : example
  })
  return code
}

// The − and + buttons are the component's own; their labels are ARIA-only, so
// name them after the field.
const field = slot('Field slot', '  ')
const [group] = instance.findConnectedInstances(isField)
let label = ''
if (group && group.type === 'INSTANCE') {
  const [layer] = group.findLayers((node) => node.type === 'TEXT')
  if (layer && layer.type === 'TEXT') label = layer.textContent.toLowerCase()
}
const subject = label ? ` ${label}` : ''

export default {
  example: figma.code`<SteppedField downLabel="Step${subject} down" upLabel="Step${subject} up" onstep={step}>
  ${field}
</SteppedField>`,
  imports,
  id: 'stepped-field',
  metadata: { nestable: true, props: { imports } },
}
