// url=<UI3_FILE>?node-id=1027197-23852
// source=src/components/LoadingState.svelte
// component=LoadingState
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { LoadingState } from 'figma-plugin-utilities'"]

const message = instance.getString('🎛️ Message')

export default {
  example: figma.code`<LoadingState${message !== 'Loading...' ? figma.code` message="${message}"` : ''} />`,
  imports,
  id: 'loading-state',
  metadata: { nestable: true, props: { imports } },
}
