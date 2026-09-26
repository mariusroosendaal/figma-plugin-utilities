// Responsive scale math shared by plugins that shape a scale across
// breakpoints, such as Type Tools and Spacing Sets: the ramp's quadratic
// Bézier, blending by viewport width, values between breakpoints, fallback
// widths and fluid CSS. Pure — no Figma API — so both threads may import it.
//
// Units are the caller's: Type Tools works in px along its ladder, Spacing
// Sets in ladder rungs. Nothing here maps a value onto a ladder.

/** The quadratic Bézier through p0 and p2, pulled toward p1, at t in 0…1. */
export const bezier = (t: number, p0: number, p1: number, p2: number) =>
  (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

/** How far the bend may move toward either end; at 0 or 1 the curve folds. */
export const clampPosition = (c: number) => Math.min(0.98, Math.max(0.02, c));

/**
 * The curve's parameter t for a point at x, 0…1, when the bend sits at `c`
 * along x: the curve runs through x(t) = 2(1−t)t·c + t², solved for t in the
 * conjugate form, which has no division by zero at c = 0.5 (where t = x).
 */
export function levelT(x: number, c = 0.5): number {
  const pos = clampPosition(c);
  return x / (Math.sqrt(pos * pos + (1 - 2 * pos) * x) + pos);
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Rounds halves down, so a growing value holds its smaller size a breakpoint
 * longer — 16 16 18 18 20 rather than 16 18 18 20 20.
 */
export const roundHalfDown = (x: number) => Math.ceil(x - 0.5);

/**
 * How far breakpoint `index` sits from the smallest toward the largest, 0…1:
 * by viewport width when every width is known and they widen, so the blend
 * matches CSS vw, and evenly by position otherwise.
 */
export function blendAt(
  index: number,
  count: number,
  widths?: number[],
): number {
  if (count < 2) return 0;
  const w0 = widths?.[0];
  const w1 = widths?.[count - 1];
  if (
    widths?.length === count &&
    w0 !== undefined &&
    w1 !== undefined &&
    w1 > w0
  ) {
    return Math.min(1, Math.max(0, (widths[index] - w0) / (w1 - w0)));
  }
  return index / (count - 1);
}

/**
 * A value at viewport width `width`, from its value at each breakpoint:
 * straight between the breakpoints either side, as fluid CSS has it, and
 * held beyond the smallest and largest. Stepped, it is the value of the last
 * breakpoint at or below the width, as a media query holds it.
 */
export function valueAtWidth(
  widths: number[],
  values: number[],
  width: number,
  stepped = false,
): number {
  const last = widths.length - 1;
  if (last < 0) return 0;
  if (width <= widths[0]) return values[0];
  if (width >= widths[last]) return values[last];
  let b = 0;
  while (b < last - 1 && widths[b + 1] <= width) b++;
  if (stepped) return values[b];
  const t = (width - widths[b]) / (widths[b + 1] - widths[b]);
  return values[b] + (values[b + 1] - values[b]) * t;
}

/** Breakpoint widths by name, for a file that doesn't give them. */
export const FALLBACK_WIDTHS: Record<string, number> = {
  xs: 320,
  sm: 400,
  md: 768,
  lg: 1024,
  xl: 1440,
  xlg: 1440,
  "2xl": 1920,
  xxl: 1920,
  "3xl": 2560,
  xxxl: 2560,
  max: 2560,
};

/** Whether a name is one the fallback widths know, in any case. */
export const isBreakpointName = (name: string) =>
  Object.prototype.hasOwnProperty.call(FALLBACK_WIDTHS, name.toLowerCase());

/**
 * Each breakpoint's width: the file's (`known`), else the usual one for its
 * name, else 400px past the one before. Out of order, a width is taken as
 * unknown — a breakpoint can't sit narrower than the one before it.
 */
export function widthsFor(
  names: string[],
  known: Record<string, number> = {},
): number[] {
  const out: number[] = [];
  names.forEach((name, i) => {
    const previous = out[i - 1] ?? 0;
    const given = known[name] ?? FALLBACK_WIDTHS[name.toLowerCase()];
    out.push(
      given !== undefined && given > previous
        ? given
        : previous
          ? previous + 400
          : 400,
    );
  });
  return out;
}

/** A number as CSS writes it: no trailing zeros, at most `places` decimals. */
export const trimNumber = (n: number, places = 4) =>
  String(Number(n.toFixed(places)));

/**
 * A length fluid between two viewport widths, as CSS: `from` at `w0`, `to`
 * at `w1`, straight between and held beyond — a clamp() over vw, or the
 * length alone when it doesn't change. `length` writes a px value in the
 * caller's unit, such as `(px) => `${px / 16}rem``.
 */
export function fluidClamp(
  from: number,
  to: number,
  w0: number,
  w1: number,
  length: (px: number) => string,
): string {
  if (w1 === w0 || Math.abs(from - to) < 1e-9) return length(from);
  const slope = (to - from) / (w1 - w0);
  const intercept = from - slope * w0;
  const vw = slope * 100;
  const sign = vw < 0 ? "-" : "+";
  return `clamp(${length(Math.min(from, to))}, ${length(intercept)} ${sign} ${trimNumber(Math.abs(vw))}vw, ${length(Math.max(from, to))})`;
}
