// url=<UI3_FILE>?node-id=1027197-23800
// source=src/components/Footer.svelte
// component=Footer
import figma from 'figma'
const instance = figma.selectedInstance

const variant = instance.getEnum('👥 Variant', { 'Right': 'right', 'Split': 'split', 'Full': 'full' })

let example
if (variant === 'split') {
  example = figma.code`<Footer variant="split">
  <svelte:fragment slot="left">
    ${instance.getSlot('Left slot')}
  </svelte:fragment>
  <svelte:fragment slot="right">
    ${instance.getSlot('Right slot')}
  </svelte:fragment>
</Footer>`
} else {
  example = figma.code`<Footer${variant === 'full' ? ' variant="full"' : ''}>
  ${instance.getSlot('Actions slot')}
</Footer>`
}

export default {
  example,
  imports: ["import { Footer } from 'figma-plugin-utilities'"],
  id: 'plugin-footer',
  metadata: { nestable: true },
}
