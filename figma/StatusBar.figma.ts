// url=<UI3_FILE>?node-id=1027197-23902
// source=src/components/StatusBar.svelte
// component=StatusBar
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { StatusBar } from 'figma-plugin-utilities'"]

const message = instance.getString('🎛️ Message')
const type = instance.getEnum('👥 Type', {
  'Info': 'info',
  'Success': 'success',
  'Warning': 'warning',
  'Error': 'error',
})

export default {
  example: figma.code`<StatusBar message="${message}"${type !== 'info' ? figma.code` type="${type}"` : ''} />`,
  imports,
  id: 'status-bar',
  metadata: { nestable: true, props: { imports } },
}
