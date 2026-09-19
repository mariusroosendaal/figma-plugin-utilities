// url=<UI3_FILE>?node-id=1027197-23913
// source=src/components/FieldGroup.svelte
// component=FieldGroup
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

const size = instance.getEnum('👥 Size', { 'Default': 'default', 'Small': 'small' })
const label = instance.getBoolean('👁️ Label') ? instance.getString('🎛️ Label') : ''
const control = slot('Control slot', '  ')

export default {
  example: figma.code`<FieldGroup${label ? figma.code` label="${label}"` : ''}${size === 'small' ? ' size="small"' : ''}>
  ${control}
</FieldGroup>`,
  imports: ["import { FieldGroup } from 'figma-plugin-utilities'"],
  id: 'field-group',
  metadata: { nestable: true },
}
