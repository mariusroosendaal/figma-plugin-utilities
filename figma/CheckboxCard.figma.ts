// url=<UI3_FILE>?node-id=1027197-24237
// source=src/components/CheckboxCard.svelte
// component=CheckboxCard
import figma from 'figma'
const instance = figma.selectedInstance

const disabled = instance.getEnum('🎛️ Disabled', { 'False': false, 'True': true })
const secondary = instance.getBoolean('👁️ Secondary') ? instance.getString('🎛️ Secondary') : ''

// Checked state and label live on the exposed Checkbox instance.
let checked = false
let label = ''
const checkbox = instance.findInstance('Checkbox')
if (checkbox && checkbox.type === 'INSTANCE') {
  checked = checkbox.getEnum('🐣 Type', { 'Checked': true, 'Unchecked': false, 'Mixed': false })
  const value = checkbox.findText('Value')
  if (value && value.type === 'TEXT') label = value.textContent
}

export default {
  example: figma.code`<CheckboxCard${checked ? ' checked' : ''}${disabled ? ' disabled' : ''}>
  ${label}${secondary ? figma.code`
  <svelte:fragment slot="secondary">${secondary}</svelte:fragment>` : ''}
</CheckboxCard>`,
  imports: ["import { CheckboxCard } from 'figma-plugin-utilities'"],
  id: 'checkbox-card',
  metadata: { nestable: true },
}
