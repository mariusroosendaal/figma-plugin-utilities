// url=<UI3_FILE>?node-id=1027197-23800
// source=src/components/Footer.svelte
// component=Footer
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { Footer } from 'figma-plugin-utilities'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

// Render a slot's connected children inline. getSlot() alone makes Dev Mode emit
// React helper functions, so it's only the fallback for unconnected content.
function slot(name, indent) {
  const children = instance.findConnectedInstances(() => true, { path: [name] })
  if (!children.length) return instance.getSlot(name)
  let code
  children.forEach((child) => {
    const example = render(child)
    code = code ? figma.code`${code}\n${indent}${example}` : example
  })
  return code
}

const variant = instance.getEnum('👥 Variant', { 'Right': 'right', 'Split': 'split', 'Full': 'full' })

let example
if (variant === 'split') {
  example = figma.code`<Footer variant="split">
  <svelte:fragment slot="left">
    ${slot('Left slot', '    ')}
  </svelte:fragment>
  <svelte:fragment slot="right">
    ${slot('Right slot', '    ')}
  </svelte:fragment>
</Footer>`
} else {
  example = figma.code`<Footer${variant === 'full' ? ' variant="full"' : ''}>
  ${slot('Actions slot', '  ')}
</Footer>`
}

export default {
  example,
  imports,
  id: 'plugin-footer',
  metadata: { nestable: true, props: { imports } },
}
