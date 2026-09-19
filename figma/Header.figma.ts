// url=<UI3_FILE>?node-id=1027197-23734
// source=src/components/Header.svelte
// component=Header
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getBoolean('👁️ Title') ? instance.getString('🎛️ Title') : ''
const noBorder = !instance.getBoolean('👁️ Border')
const left = instance.getBoolean('👁️ Left slot') ? instance.getSlot('Left slot') : undefined
const center = instance.getBoolean('👁️ Center slot') ? instance.getSlot('Center slot') : undefined
const right = instance.getSlot('Right slot')

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
