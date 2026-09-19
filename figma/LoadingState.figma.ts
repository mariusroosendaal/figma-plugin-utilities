// url=<UI3_FILE>?node-id=1027197-23852
// source=src/components/LoadingState.svelte
// component=LoadingState
import figma from 'figma'
const instance = figma.selectedInstance

const message = instance.getString('🎛️ Message')

export default {
  example: figma.code`<LoadingState${message !== 'Loading...' ? figma.code` message="${message}"` : ''} />`,
  imports: ["import { LoadingState } from 'figma-plugin-utilities'"],
  id: 'loading-state',
  metadata: { nestable: true },
}
