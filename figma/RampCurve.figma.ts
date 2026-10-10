// url=<UI3_FILE>?node-id=1027599-473
// source=src/components/RampCurve.svelte
// component=RampCurve
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { RampCurve } from 'figma-plugin-utilities'"]

// The chart is drawn from the caller's ramp maths, which Figma can't hold, so
// the data props stay variables, `selected` too: Editable is the smallest or
// the largest breakpoint, which the design can't say; the others are blends,
// shown only.
const editable = instance.getEnum('🐣 Editable', { 'True': true, 'False': false })
const dropdown = instance.findInstance('Breakpoint')
let shown = ''
if (dropdown && dropdown.type === 'INSTANCE') {
  const value = dropdown.findText('Value')
  if (value && value.type === 'TEXT') shown = value.textContent
}

export default {
  example: figma.code`<!-- ${shown || 'The breakpoint'} shown${editable ? ', its ends and bend editable' : ', calculated from the endpoints'} -->
<RampCurve
  {ramp}
  {curves}
  {span}
  {grid}
  {dots}
  {breakpoints}
  {selected}
  ariaLabel="Heading ramp"
  onchange={updateRamp}
  onselect={(index) => (selected = index)}
/>`,
  imports,
  id: 'ramp-curve',
  metadata: { nestable: true, props: { imports } },
}
