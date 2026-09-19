// url=<UI3_FILE>?node-id=1027197-23851
// source=src/components/EmptyState.svelte
// component=EmptyState
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { EmptyState } from 'figma-plugin-utilities'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const message = instance.getString('🎛️ Message')
const size = instance.getEnum('👥 Size', { 'Small': 'small', 'Medium': 'medium', 'Large': 'large' })

let iconCode
if (instance.getBoolean('👁️ Icon')) {
  const icon = instance.getInstanceSwap('↪ Icon')
  if (icon && icon.type === 'INSTANCE') iconCode = render(icon)
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
  imports,
  id: 'empty-state',
  metadata: { nestable: true, props: { imports } },
}
