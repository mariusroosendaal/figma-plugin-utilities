// url=<UI3_FILE>?node-id=1027596-502
// source=src/components/LadderBadges.svelte
// component=LadderBadges
import figma from 'figma'
const instance = figma.selectedInstance

// Dev Mode only lifts imports one level, so every template also reports its full
// import list in metadata.props.imports for parent templates to merge.
const imports = ["import { LadderBadges } from 'figma-plugin-utilities'"]

// LadderBadges is data-driven: each badge in the slot is one size, used unless
// it's the Archived badge. Titles are the caller's wording. No `path`: it finds
// nothing once this template runs nested in another.
const badges = instance
  .findConnectedInstances(() => true)
  .map((badge) => {
    const [layer] = badge.findLayers((node) => node.type === 'TEXT')
    const text = layer && layer.type === 'TEXT' ? layer.textContent : ''
    const used = badge.getEnum('👥 Variant', { 'Archived': false }) !== false
    const value = /^-?\d+(\.\d+)?$/.test(text) ? text : JSON.stringify(text)
    return `  { value: ${value}, used: ${used}, title: '${text}px${used ? '' : ', unused'}' },`
  })

export default {
  example: figma.code`<LadderBadges ariaLabel="Scale sizes in pixels" badges={[
${badges.join('\n')}
]} />`,
  imports,
  id: 'ladder-badges',
  metadata: { nestable: true, props: { imports } },
}
