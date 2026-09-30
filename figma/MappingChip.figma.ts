// url=<UI3_FILE>?node-id=1027594-377
// source=src/components/MappingChip.svelte
// component=MappingChip
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { MappingChip } from 'figma-plugin-utilities'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}

const label = instance.getString('🎛️ Label')
const lead = instance.getEnum('🎛️ Lead', { 'False': 'none', 'Icon': 'icon', 'Chit': 'chit' })
const tone = instance.getEnum('👥 Tone', { 'Default': 'default', 'Secondary': 'secondary', 'Component': 'component' })
const state = instance.getEnum('🐣 State', { 'Default': 'default', 'Selected': 'selected', 'Disabled': 'disabled' })
// The preview layer reads "· preview"; code adds the dot itself.
const preview = instance.getBoolean('👁️ Preview') ? instance.getString('🎛️ Preview').replace(/^\s*·\s*/, '') : ''
const count = instance.getBoolean('👁️ Count') ? instance.getString('🎛️ Count') : ''

let iconCode
if (lead === 'icon') {
  const icon = instance.getInstanceSwap('↪ Icon')
  if (icon && icon.type === 'INSTANCE') iconCode = render(icon)
}
// Code Connect can't read fills, so a chit's color stays a placeholder.
const chit = lead === 'chit' ? ' chit="#0D99FF"' : ''
const countAttr = count === '' ? '' : /^\d+$/.test(count) ? ` count={${count}}` : ` count="${count}"`

export default {
  example: figma.code`<MappingChip label="${label}"${preview ? figma.code` preview="${preview}"` : ''}${countAttr}${iconCode ? figma.code` iconName={${iconCode}}` : ''}${chit}${tone !== 'default' ? figma.code` tone="${tone}"` : ''}${state === 'selected' ? ' selected' : ''}${state === 'disabled' ? ' disabled' : ''} />`,
  imports,
  id: 'mapping-chip',
  metadata: { nestable: true, props: { imports } },
}
