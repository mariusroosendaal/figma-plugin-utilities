// The Scale tab of Spacing Sets, a plugin since rolled into Vitrine Tools'
// Spacing tab, in its default state. Append after build-mockup.js in a
// use_figma call. It no longer matches a live screen: keep it as an example of
// a full spec, with its values written in, as a mockup of a real plugin takes
// them from the plugin's own code.

const bp = ['sm', 'md', 'lg', 'xl', '2xl']
const ladder = [4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 256, 320, 384, 512]
const sets = [[[4,4,4,4,4],'1.00'],[[8,8,8,8,8],'1.00'],[[12,12,16,16,16],'1.33'],[[16,16,24,24,24],'1.50'],[[24,32,32,40,40],'1.67'],[[32,40,48,48,64],'2.00'],[[40,48,64,64,80],'2.00'],[[48,64,80,80,96],'2.00'],[[64,80,96,96,128],'2.00'],[[80,96,128,128,160],'2.00'],[[96,128,160,160,192],'2.00'],[[128,160,192,192,256],'2.00'],[[160,192,256,256,320],'2.00'],[[192,256,320,320,384],'2.00']]

const fg = (label, control) => ({ c: 'FieldGroup', props: { label, size: 'small' }, children: [control] })
const num = (v) => ({ c: 'Input', props: { type: 'number', value: v } })
const dd = (v) => ({ c: 'Dropdown', props: { value: { label: v } } })
const legend = (t) => ({ text: t, variant: 'body-medium' })
const small = (t, color) => ({ text: String(t), variant: 'body-small', color: color || 'text' })
const rung = (v) => ({ stack: 'h', padding: [2, 5, 2, 5], fill: 'bg-secondary', radius: 3, name: 'Rung', children: [small(v, 'text-secondary')] })
const row = (cells, color) => ({
  stack: 'h', gap: 4, padding: [3, 0, 3, 0], name: 'Table row',
  children: cells.map((c, i) => ({ ...small(c, color || (i === cells.length - 1 ? 'text-secondary' : 'text')), align: i === 0 ? 'left' : 'right', ...(i === 0 ? { width: 88 } : { grow: true }) })),
})

const SPEC = {
  window: 'Spacing Sets — Scale tab', width: 320, height: 720,
  children: [
    { c: 'Header', slots: { left: [{ c: 'Tabs', props: { tabs: [{ label: 'Scale' }, { label: 'Variables' }], selectedTab: 0 } }] } },
    { c: 'PluginLayout', children: [
      { stack: 'v', gap: 8, name: 'Ladder', children: [
        legend('Ladder'),
        { grid: 2, gap: 8, children: [fg('Base (px)', num('4')), fg('Maximum (px)', num('512')), fg('Subdivision', dd('Harmonic')), fg('Steps per octave', num('3')), fg('Density ramp', num('1.5')), fg('Snap grid (px)', num('4'))] },
        { stack: 'h', gap: 4, wrap: true, name: 'Generated ladder', children: ladder.map(rung) },
      ] },
      { divider: true },
      { stack: 'v', gap: 8, name: 'Sets', children: [
        legend('Sets'),
        { grid: 2, gap: 8, children: [fg('Number of sets', num('14')), fg('Fixed below set', num('3')), fg('Growth (octaves)', num('1')), fg('Growth ramp (sets)', num('4')), fg('Mode', dd('Discrete'))] },
        small('2.00× from sm to 2xl', 'text-secondary'),
      ] },
      { divider: true },
      { stack: 'v', gap: 8, name: 'Breakpoints', children: [legend('Breakpoints'), fg('Modes from', dd('Breakpoints (5 modes)')), small(bp.join(' · ') + ' · 400–1916px', 'text-secondary')] },
      { divider: true },
      { stack: 'v', gap: 8, name: 'Primitives', children: [legend('Primitives'), { c: 'Checkbox', props: { checked: false }, children: 'Use size primitives exclusively' }, fg('Primitive collection', dd('Primitives (1 mode)'))] },
      { divider: true },
      { stack: 'v', gap: 0, name: 'Generated sets', children: [row(['token', ...bp, '×'], 'text-secondary'), ...sets.map(([v, g], i) => row(['spacing/' + (i + 1), ...v, g]))] },
    ] },
    { c: 'Footer', props: { variant: 'split' }, slots: {
      left: [{ c: 'Button', props: { variant: 'secondary' }, children: 'Preview on canvas' }],
      right: [{ c: 'Tooltip', props: { label: 'Select a collection on the Variables tab', direction: 'TopRight' }, children: [{ c: 'Button', props: { variant: 'primary' }, children: 'Save to variables' }] }],
    } },
  ],
}

const result = await buildMockup(SPEC, { page: '1027190:25' })
const root = await figma.getNodeByIdAsync(result.root)
await root.screenshot({ scale: 1 })
return result
