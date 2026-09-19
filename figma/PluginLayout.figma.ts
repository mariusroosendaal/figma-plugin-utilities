// url=<UI3_FILE>?node-id=1027197-23801
// source=src/components/PluginLayout.svelte
// component=PluginLayout
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

const content = slot('Content slot', '  ')

export default {
  example: figma.code`<PluginLayout>
  ${content}
</PluginLayout>`,
  imports: ["import { PluginLayout } from 'figma-plugin-utilities'"],
  id: 'plugin-layout',
  metadata: { nestable: true },
}
