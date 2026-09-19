// url=<UI3_FILE>?node-id=1027197-23734
// source=src/components/Header.svelte
// component=Header
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

const title = instance.getBoolean('👁️ Title') ? instance.getString('🎛️ Title') : ''
const noBorder = !instance.getBoolean('👁️ Border')
const left = instance.getBoolean('👁️ Left slot') ? slot('Left slot', '    ') : undefined
const center = instance.getBoolean('👁️ Center slot') ? slot('Center slot', '    ') : undefined
const right = slot('Right slot', '    ')

const fragment = (name, content) =>
  content ? figma.code`
  <svelte:fragment slot="${name}">
    ${content}
  </svelte:fragment>` : ''

export default {
  example: figma.code`<Header${title ? figma.code` title="${title}"` : ''}${noBorder ? ' noBorder' : ''}>${fragment('left', left)}${fragment('center', center)}${fragment('right', right)}
</Header>`,
  imports: ["import { Header } from 'figma-plugin-utilities'"],
  id: 'plugin-header',
  metadata: { nestable: true },
}
