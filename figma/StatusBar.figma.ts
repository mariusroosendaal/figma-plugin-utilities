// url=<UI3_FILE>?node-id=1027197-23902
// source=src/components/StatusBar.svelte
// component=StatusBar
import figma from 'figma'
const instance = figma.selectedInstance

const message = instance.getString('🎛️ Message')
const type = instance.getEnum('👥 Type', {
  'Info': 'info',
  'Success': 'success',
  'Warning': 'warning',
  'Error': 'error',
})

export default {
  example: figma.code`<StatusBar message="${message}"${type !== 'info' ? figma.code` type="${type}"` : ''} />`,
  imports: ["import { StatusBar } from 'figma-plugin-utilities'"],
  id: 'status-bar',
  metadata: { nestable: true },
}
