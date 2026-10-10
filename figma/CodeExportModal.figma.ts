// url=<UI3_FILE>?node-id=1027600-85
// source=src/components/CodeExportModal.svelte
// component=CodeExportModal
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { CodeExportModal } from 'figma-plugin-utilities'"]
const render = (handle) => {
  const result = handle.executeTemplate()
  const nested = result.metadata && result.metadata.props && result.metadata.props.imports
  if (nested) nested.forEach((i) => imports.includes(i) || imports.push(i))
  return result.example
}
// A nested child's code can span lines; indent each, not only the first.
const indented = (sections, indent) =>
  sections.map((s) =>
    s.type === 'CODE'
      ? { ...s, code: s.code.replace(/\n/g, `\n${indent}`) }
      : s.type === 'INSTANCE' && s.resultSections
        ? { ...s, resultSections: indented(s.resultSections, indent) }
        : s,
  )

// Everything is read off the exposed kit Modal: its title and width, the code
// in its Textarea, the copy button's label, and any controls above the code.
// No `path`: it finds nothing on a nested instance, so layers go by name.
let title = ''
let width = 'medium'
let copyLabel = 'Copy'
let controls
const modal = instance.findInstance('Modal')
if (modal && modal.type === 'INSTANCE') {
  title = modal.getString('🎛️ Title')
  width = modal.getEnum('👥 Width', { 'Small': 'small', 'Medium': 'medium', 'Large': 'large' })
  const [button] = modal.findLayers((node) => node.type === 'INSTANCE' && node.name === 'Button')
  if (button && button.type === 'INSTANCE') copyLabel = button.getString('🎛️ Label')
  modal
    .findConnectedInstances((node) => !['Textarea', 'Button', 'Close', 'Icon 2'].includes(node.name))
    .forEach((child) => {
      const example = indented(render(child), '    ')
      controls = controls ? figma.code`${controls}\n    ${example}` : example
    })
}

export default {
  example: figma.code`<CodeExportModal
  bind:isOpen
  title="${title}"
  value={code}
  ariaLabel="Exported ${title.replace(/^Export\s+/i, '')}"
  copyLabel="${copyLabel}"${width !== 'medium' ? figma.code`
  width="${width}"` : ''}
>${controls ? figma.code`
  {#snippet controls()}
    ${controls}
  {/snippet}
` : ''}</CodeExportModal>`,
  imports,
  id: 'code-export-modal',
  metadata: { nestable: true, props: { imports } },
}
