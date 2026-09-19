// url=<UI3_FILE>?node-id=1027197-23913
// source=src/components/FieldGroup.svelte
// component=FieldGroup
import figma from 'figma'
const instance = figma.selectedInstance

const size = instance.getEnum('👥 Size', { 'Default': 'default', 'Small': 'small' })
const label = instance.getBoolean('👁️ Label') ? instance.getString('🎛️ Label') : ''
const control = instance.getSlot('Control slot')

export default {
  example: figma.code`<FieldGroup${label ? figma.code` label="${label}"` : ''}${size === 'small' ? ' size="small"' : ''}>
  ${control}
</FieldGroup>`,
  imports: ["import { FieldGroup } from 'figma-plugin-utilities'"],
  id: 'field-group',
  metadata: { nestable: true },
}
