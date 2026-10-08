// url=<UI3_FILE>?node-id=1027197-23913
// source=src/components/FieldGroup.svelte
// component=FieldGroup
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { FieldGroup } from 'figma-plugin-utilities'"]
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

// Render a slot's connected children inline. getSlot() alone makes Dev Mode emit
// React helper functions, so it's only the fallback for unconnected content.
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

const size = instance.getEnum('👥 Size', { 'Default': 'default', 'Small': 'small' })
const label = instance.getBoolean('👁️ Label') ? instance.getString('🎛️ Label') : ''
const hint = instance.getBoolean('👁️ Hint') ? instance.getString('🎛️ Hint') : ''
const control = slot('Control slot', '  ')

export default {
  example: figma.code`<FieldGroup${label ? figma.code` label="${label}"` : ''}${size === 'small' ? ' size="small"' : ''}${hint ? figma.code` hint="${hint}"` : ''}>
  ${control}
</FieldGroup>`,
  imports,
  id: 'field-group',
  metadata: { nestable: true, props: { imports } },
}
