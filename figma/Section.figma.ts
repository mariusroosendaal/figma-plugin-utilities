// url=<UI3_FILE>?node-id=1027600-38
// source=src/components/Section.svelte
// component=Section
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Section } from 'figma-plugin-utilities'"]
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

// Render a slot's connected children inline; getSlot() is the fallback for
// unconnected content (it makes Dev Mode emit helper functions). Optional slots
// with no connected children are omitted instead. No `path`: it finds nothing
// once this template runs nested in another, so layers are picked by `select`.
function slot(owner, name, indent, optional = false, select = () => true) {
  const children = owner.findConnectedInstances(select)
  if (!children.length) return optional ? '' : owner.getSlot(name)
  let code
  children.forEach((child) => {
    const example = indented(render(child), indent)
    code = code ? figma.code`${code}\n${indent}${example}` : example
  })
  return code
}

// The title and the actions live on the exposed Plugin header.
let title = ''
let actions = ''
const header = instance.findInstance('Plugin header')
if (header && header.type === 'INSTANCE') {
  title = header.getBoolean('👁️ Title') ? header.getString('🎛️ Title') : ''
  actions = slot(header, 'Right slot', '    ', true)
}
const content = slot(instance, 'Content slot', '  ', false, (node) => node.name !== 'Plugin header')

export default {
  example: figma.code`<Section title="${title}">${actions ? figma.code`
  {#snippet actions()}
    ${actions}
  {/snippet}` : ''}
  ${content}
</Section>`,
  imports,
  id: 'section',
  metadata: { nestable: true, props: { imports } },
}
