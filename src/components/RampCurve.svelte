<!--
  A ramp's quadratic Bézier at the breakpoint shown, with the other
  breakpoints' curves faint behind it, from Type Tools' and Spacing Sets'
  ramp editors. Everything up the y axis is in the caller's units — px along
  a type ladder, rungs of a spacing one — so the caller passes the curves,
  the grid lines, the dots and how a point snaps to a rung. At the smallest
  and largest breakpoint the three control points are handles: bottom and
  top move whole rungs, the bend moves anywhere and slides along x, the same
  at every breakpoint. Those between are blends, only shown. Fires `change`
  with a patch of the ramp, and `select` with a breakpoint's index.
-->
<script>
  import { createEventDispatcher } from "svelte";
  import { Button, Dropdown, Text } from "figma-ui3-kit-svelte";
  import { clampPosition } from "../lib/scale";

  /**
   * The ends in rungs and the bends at the smallest (`Sm`) and largest
   * (`Lg`) breakpoint, and where along x the bend sits.
   * @type {{ bottomSm: number, topSm: number, bendSm: number, bottomLg: number, topLg: number, bendLg: number, bendPosition?: number }}
   */
  export let ramp;
  /** @type {[number, number, number][]} Each breakpoint's P0, P1 and P2. */
  export let curves = [];
  /** @type {[number, number]} The y range shown. */
  export let span = [0, 1];
  /** @type {{ key: string | number, y: number, label: string | number }[]} */
  export let grid = [];
  /** @type {{ key: string | number, x: number, y: number, marked?: boolean }[]} x from 0 to 1. */
  export let dots = [];
  /** @type {string[]} Breakpoint names. */
  export let breakpoints = [];
  /** Index of the breakpoint shown. */
  export let selected = 0;
  /** How many rungs the ends can take. */
  export let rungCount = 2;
  /** The rung nearest a y value, for dragging an end. */
  export let rungAt = (y) => y;
  /** An end's y value as its slider reads it, e.g. "16px". */
  export let format = (y) => `${Math.round(y)}`;
  /** Names the chart, e.g. "Heading ramp"; the breakpoint follows. */
  export let ariaLabel;
  export let bottomLabel = "First";
  export let topLabel = "Last";
  /** What runs along x, for the bend's value, e.g. "levels". */
  export let along = "sets";

  const dispatch = createEventDispatcher();

  const W = 240;
  const H = 180;
  const PAD = { left: 28, right: 8, top: 8, bottom: 8 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  $: lastIndex = breakpoints.length - 1;
  $: editable = selected === 0 || selected === lastIndex;
  $: end = selected === 0 ? "Sm" : "Lg";
  $: topRung = Math.max(1, rungCount - 1);
  $: breakpointItems = breakpoints.map((name, b) => ({
    label: name,
    value: b,
  }));
  $: breakpointItem = breakpointItems.find((i) => i.value === selected) ?? null;

  // While dragging, the axis holds still; rescaling under the pointer would
  // make the handle run away from it.
  let frozen = null;
  $: [yMin, yMax] = frozen ?? span;
  const X = (x) => PAD.left + x * plotW;
  const toY = (v, lo, hi) => PAD.top + plotH - ((v - lo) / (hi - lo)) * plotH;
  const fromY = (y, lo, hi) => lo + ((PAD.top + plotH - y) / plotH) * (hi - lo);

  // Coordinates are worked out here, not in the markup: a helper called from
  // the markup would not re-run when the ramp changes.
  // Lines in view, labelled where there's room.
  $: lines = grid
    .map((g) => ({ ...g, cy: toY(g.y, yMin, yMax) }))
    .filter((g) => g.y >= yMin && g.y <= yMax)
    .reduce((acc, g) => {
      const labelled = acc.filter((a) => a.label !== null);
      const prev = labelled[labelled.length - 1];
      acc.push({ ...g, label: !prev || prev.cy - g.cy >= 10 ? g.label : null });
      return acc;
    }, []);

  $: position = clampPosition(ramp.bendPosition ?? 0.5);
  // A quadratic with its control point at (position, P1): SVG draws it as is.
  function pathFor([p0, p1, p2], c, lo, hi) {
    return `M${X(0)},${toY(p0, lo, hi)} Q${X(c)},${toY(p1, lo, hi)} ${X(1)},${toY(p2, lo, hi)}`;
  }
  $: paths = curves.map((p) => pathFor(p, position, yMin, yMax));
  $: current = curves[selected] ?? [0, 0, 0];
  $: polygon = [0, position, 1]
    .map((x, i) => `${i ? "L" : "M"}${X(x)},${toY(current[i], yMin, yMax)}`)
    .join(" ");
  $: circles = dots.map((d) => ({
    ...d,
    cx: X(d.x),
    cy: toY(d.y, yMin, yMax),
  }));

  $: bend = end === "Sm" ? ramp.bendSm : ramp.bendLg;
  $: handles = [
    { id: "bottom", x: 0, y: current[0], label: bottomLabel },
    { id: "bend", x: position, y: current[1], label: "Bend" },
    { id: "top", x: 1, y: current[2], label: topLabel },
  ].map((h) => ({
    ...h,
    cx: X(h.x),
    cy: toY(h.y, yMin, yMax),
    valueNow: h.id === "bend" ? bend : ramp[`${h.id}${end}`],
    valueMin: h.id === "bend" ? -0.5 : 0,
    valueMax: h.id === "bend" ? 1.5 : topRung,
    valueText:
      h.id === "bend"
        ? `bend ${bend.toFixed(2)}, at ${position.toFixed(2)} along the ${along}`
        : format(h.y),
  }));

  function setBend(value) {
    const rounded = Math.round(value * 100) / 100;
    dispatch("change", { [`bend${end}`]: clamp(rounded, -0.5, 1.5) });
  }
  function setPosition(value) {
    dispatch("change", {
      bendPosition: clampPosition(Math.round(value * 100) / 100),
    });
  }
  function setEnd(handle, rung) {
    dispatch("change", {
      [`${handle}${end}`]: clamp(Math.round(rung), 0, topRung),
    });
  }

  let svg;
  let dragging = null;
  function yAt(event) {
    const box = svg.getBoundingClientRect();
    const y = ((event.clientY - box.top) / box.height) * H;
    return fromY(y, yMin, yMax);
  }
  // Where along x the pointer is, 0…1.
  function xAt(event) {
    const box = svg.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * W;
    return (x - PAD.left) / plotW;
  }
  function handleDown(event, handle) {
    if (!editable) return;
    dragging = handle;
    frozen = [yMin, yMax];
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
  }
  function handleMove(event) {
    if (!dragging) return;
    const y = yAt(event);
    if (dragging === "bend") {
      const range = current[2] - current[0];
      if (range !== 0) setBend((y - current[0]) / range);
      setPosition(xAt(event));
    } else {
      setEnd(dragging, rungAt(y));
    }
  }
  function handleUp() {
    dragging = null;
    frozen = null;
  }
  function handleKey(event, handle) {
    if (
      handle === "bend" &&
      (event.key === "ArrowLeft" || event.key === "ArrowRight")
    ) {
      event.preventDefault();
      setPosition(position + (event.key === "ArrowRight" ? 0.02 : -0.02));
      return;
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const up = event.key === "ArrowUp" ? 1 : -1;
    if (handle === "bend") setBend(bend + up * 0.02);
    else setEnd(handle, ramp[`${handle}${end}`] + up);
  }
</script>

<div class="ramp-curve">
  <Dropdown
    menuItems={breakpointItems}
    value={breakpointItem}
    on:change={(e) => dispatch("select", e.detail.value)}
    ariaLabel="Breakpoint shown"
  />

  {#if !editable}
    <Text variant="body-small" color="--figma-color-text-secondary"
      >Calculated from the endpoints.</Text
    >
    <div class="endpoint-actions">
      <Button variant="link" on:click={() => dispatch("select", 0)}
        >Edit {breakpoints[0]}</Button
      >
      <Button variant="link" on:click={() => dispatch("select", lastIndex)}
        >Edit {breakpoints[lastIndex]}</Button
      >
    </div>
  {/if}
  <svg
    bind:this={svg}
    viewBox="0 0 {W} {H}"
    role="group"
    aria-label="{ariaLabel} at {breakpoints[selected]}"
    on:pointermove={handleMove}
    on:pointerup={handleUp}
    on:pointercancel={handleUp}
  >
    {#each lines as line (line.key)}
      <line
        class="grid"
        x1={PAD.left}
        x2={W - PAD.right}
        y1={line.cy}
        y2={line.cy}
      />
      {#if line.label !== null}
        <text class="axis" x={PAD.left - 4} y={line.cy + 3}>{line.label}</text>
      {/if}
    {/each}

    {#each paths as d, b (b)}
      {#if b !== selected}
        <path class="curve other" {d} />
      {/if}
    {/each}
    <path class="polygon" d={polygon} />
    <path class="curve" d={paths[selected]} />

    {#each circles as dot (dot.key)}
      <circle
        class="dot"
        class:marked={dot.marked}
        cx={dot.cx}
        cy={dot.cy}
        r={dot.marked ? 3 : 2.5}
      />
    {/each}

    <!-- Handles as Figma draws a path's vertices: white with a blue ring,
         solid blue while dragged or focused. A wider, invisible circle
         takes the pointer. -->
    {#if editable}
      {#each handles as h (h.id)}
        <g
          class="handle"
          class:active={dragging === h.id}
          class:bend={h.id === "bend"}
          transform="translate({h.cx} {h.cy})"
          tabindex="0"
          role="slider"
          aria-label="{h.label} at {breakpoints[selected]}"
          aria-valuenow={h.valueNow}
          aria-valuemin={h.valueMin}
          aria-valuemax={h.valueMax}
          aria-valuetext={h.valueText}
          on:pointerdown={(e) => handleDown(e, h.id)}
          on:keydown={(e) => handleKey(e, h.id)}
        >
          <circle class="hit" r="8" />
          <circle class="knob" r={h.id === "bend" ? 3 : 3.5} />
        </g>
      {/each}
    {/if}
  </svg>
</div>

<style>
  .ramp-curve {
    display: flex;
    flex-direction: column;
    gap: var(--size-xxsmall);
  }

  .endpoint-actions {
    display: flex;
    gap: var(--size-xxsmall);
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
    touch-action: none;
    user-select: none;
  }

  .grid {
    stroke: var(--figma-color-border);
    stroke-width: 0.5;
  }

  .axis {
    fill: var(--figma-color-text-secondary);
    font-size: 8px;
    font-family: var(--font-stack);
    /* Inter's tabular lining figures, Figma's "Monospace uppercase/lining". */
    font-variant-numeric: tabular-nums lining-nums;
    text-anchor: end;
  }

  .curve {
    fill: none;
    stroke: var(--figma-color-text);
    stroke-width: 1.5;
    stroke-linecap: round;
  }

  .curve.other {
    stroke: var(--figma-color-text-tertiary, var(--figma-color-text-secondary));
    stroke-width: 1;
    opacity: 0.5;
  }

  /* The handle arms, as Figma draws a Bézier's tangents. */
  .polygon {
    fill: none;
    stroke: var(--figma-color-border-selected);
    stroke-width: 1;
  }

  .dot {
    fill: var(--figma-color-bg);
    stroke: var(--figma-color-text-secondary);
    stroke-width: 1;
  }

  .dot.marked {
    fill: var(--figma-color-bg-brand);
    stroke: var(--figma-color-bg-brand);
  }

  .handle {
    cursor: ns-resize;
    outline: none;
  }

  .handle.bend {
    cursor: move;
  }

  .hit {
    fill: transparent;
  }

  .knob {
    fill: var(--figma-color-icon-onbrand, #fff);
    stroke: var(--figma-color-border-selected);
    stroke-width: 1;
  }

  .handle:hover .knob {
    stroke-width: 1.5;
  }

  .handle.active .knob,
  .handle:focus-visible .knob {
    fill: var(--figma-color-bg-brand);
    stroke: var(--figma-color-icon-onbrand, #fff);
    stroke-width: 1;
  }
</style>
