// url=<UI3_FILE>?node-id=1027197-23851
// source=src/components/EmptyState.svelte
// component=EmptyState
import figma from 'figma'
const instance = figma.selectedInstance

const message = instance.getString('🎛️ Message')
const size = instance.getEnum('👥 Size', { 'Small': 'small', 'Medium': 'medium', 'Large': 'large' })

let iconCode
if (instance.getBoolean('👁️ Icon')) {
  const icon = instance.getInstanceSwap('↪ Icon')
  if (icon && icon.type === 'INSTANCE') iconCode = icon.executeTemplate().example
}

// In code, actions are data ({ label, handler }) rendered as secondary buttons,
// so read each button's label from the actions slot instead of its snippet.
const actions = []
if (instance.getBoolean('👁️ Actions')) {
  instance.findLayers((node) => {
    if (node.type === 'INSTANCE' && node.name === 'Button') {
      const label = node.getString('🎛️ Label')
      const handler = 'handle' + label.replace(/(^|\s+)(\w)/g, (_, __, c) => c.toUpperCase()).replace(/\W/g, '')
      actions.push(`{ label: ${JSON.stringify(label)}, handler: ${handler} }`)
    }
    return false
  })
}

export default {
  example: figma.code`<EmptyState message="${message}"${size !== 'medium' ? figma.code` size="${size}"` : ''}${iconCode ? figma.code` icon={${iconCode}}` : ''}${actions.length ? ` actions={[${actions.join(', ')}]}` : ''} />`,
  imports: ["import { EmptyState } from 'figma-plugin-utilities'"],
  id: 'empty-state',
  metadata: { nestable: true },
}
