// url=<UI3_FILE>?node-id=1027197-23801
// source=src/components/PluginLayout.svelte
// component=PluginLayout
import figma from 'figma'
const instance = figma.selectedInstance

const content = instance.getSlot('Content slot')

export default {
  example: figma.code`<PluginLayout>
  ${content}
</PluginLayout>`,
  imports: ["import { PluginLayout } from 'figma-plugin-utilities'"],
  id: 'plugin-layout',
  metadata: { nestable: true },
}
