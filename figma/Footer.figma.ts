// url=<UI3_FILE>?node-id=1027197-23800
// source=src/components/Footer.svelte
// component=Footer
import figma from 'figma'
const instance = figma.selectedInstance

// Render a slot's connected children inline. getSlot() alone makes Dev Mode emit
// React helper functions, so it's only the fallback for unconnected content.
function slot(name, indent) {
  const children = instance.findConnectedInstances(() => true, { path: [name] })
  if (!children.length) return instance.getSlot(name)
  let code
  children.forEach((child) => {
    const example = child.executeTemplate().example
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
  imports: ["import { Footer } from 'figma-plugin-utilities'"],
  id: 'plugin-footer',
  metadata: { nestable: true },
}
