// url=<UI3_FILE>?node-id=1027197-23734
// source=src/components/Header.svelte
// component=Header
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Header } from 'figma-plugin-utilities'"]
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
// `path` lists every frame between the instance and the slot; empty slots are
// omitted since every Header slot is optional in code.
function slot(path, indent) {
  const children = instance.findConnectedInstances(() => true, { path })
  if (!children.length) return ''
  let code
  children.forEach((child) => {
    const example = indented(render(child), indent)
    code = code ? figma.code`${code}\n${indent}${example}` : example
  })
  return code
}

const title = instance.getBoolean('👁️ Title') ? instance.getString('🎛️ Title') : ''
const noBorder = !instance.getBoolean('👁️ Border')
const left = instance.getBoolean('👁️ Left slot') ? slot(['Left', 'Left slot'], '    ') : undefined
const center = instance.getBoolean('👁️ Center slot') ? slot(['Center slot'], '    ') : undefined
const right = slot(['Right slot'], '    ')

const fragment = (name, content) =>
  content ? figma.code`
  <svelte:fragment slot="${name}">
    ${content}
  </svelte:fragment>` : ''

export default {
  example: figma.code`<Header${title ? figma.code` title="${title}"` : ''}${noBorder ? ' noBorder' : ''}>${fragment('left', left)}${fragment('center', center)}${fragment('right', right)}
</Header>`,
  imports,
  id: 'plugin-header',
  metadata: { nestable: true, props: { imports } },
}
