export type PaddingSpec =
  | number
  | { top?: number; right?: number; bottom?: number; left?: number };

export type SpecTheme = {
  cellFill: RGB;
  cellBorder: RGB;
  text: RGB;
  chipBg: RGB;
  headerFill: RGB;
  subheaderFill: RGB;
  headingText: RGB;
};

function rgb(r: number, g: number, b: number): RGB {
  return { r, g, b };
}

function applyPadding(frame: FrameNode | ComponentNode, spec: PaddingSpec): void {
  if (typeof spec === "number") {
    frame.paddingTop = spec;
    frame.paddingRight = spec;
    frame.paddingBottom = spec;
    frame.paddingLeft = spec;
  } else {
    frame.paddingTop = spec.top ?? 0;
    frame.paddingRight = spec.right ?? 0;
    frame.paddingBottom = spec.bottom ?? 0;
    frame.paddingLeft = spec.left ?? 0;
  }
}

export const specTokens = {
  accentColors: {
    green:  rgb(0.251, 0.769, 0.349), // #40C459 — AAA
    blue:   rgb(0.412, 0.671, 1.000), // #69ABFF — AA
    purple: rgb(0.710, 0.522, 0.973), // #B585F8 — AA18
    red:    rgb(1.000, 0.482, 0.467), // #FF7B77 — DNP
  },
  fonts: {
    body:       { family: "Inter",         style: "Regular",   size: 14   },
    bodyBold:   { family: "Inter",         style: "Semi Bold", size: 14   },
    subheading: { family: "Inter",         style: "Medium",    size: 24   },
    heading:    { family: "Inter",         style: "Regular",   size: 48   },
    code:       { family: "IBM Plex Mono", style: "Regular",   size: 12   },
  },
  themes: {
    light: {
      cellFill:      rgb(1.000, 1.000, 1.000),
      cellBorder:    rgb(0.949, 0.949, 0.949),
      text:          rgb(0.102, 0.102, 0.102),
      chipBg:        rgb(0.949, 0.949, 0.949),
      headerFill:    rgb(1.000, 1.000, 1.000),
      subheaderFill: rgb(0.961, 0.961, 0.961),
      headingText:   rgb(0.000, 0.000, 0.000),
    } satisfies SpecTheme,
    dark: {
      cellFill:      rgb(0.102, 0.102, 0.102),
      cellBorder:    rgb(0.133, 0.133, 0.133),
      text:          rgb(1.000, 1.000, 1.000),
      chipBg:        rgb(0.200, 0.200, 0.200),
      headerFill:    rgb(0.000, 0.000, 0.000),
      subheaderFill: rgb(0.000, 0.000, 0.000),
      headingText:   rgb(1.000, 1.000, 1.000),
    } satisfies SpecTheme,
  },
};

export async function loadSpecFonts(): Promise<void> {
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "IBM Plex Mono", style: "Regular" }),
  ]);
}

type AutoLayoutOpts = {
  name: string;
  direction: "HORIZONTAL" | "VERTICAL" | "NONE";
  spacing?: number;
  padding?: PaddingSpec;
  fill?: RGB;
  cornerRadius?: number;
  width?: number;
  height?: number;
  clipsContent?: boolean;
  border?: { color: RGB; width?: number };
};

function applyAutoLayout(node: FrameNode | ComponentNode, opts: AutoLayoutOpts): void {
  node.name = opts.name;
  node.layoutMode = opts.direction;
  node.fills = opts.fill ? [{ type: "SOLID", color: opts.fill }] : [];

  if (opts.cornerRadius !== undefined) node.cornerRadius = opts.cornerRadius;
  if (opts.clipsContent !== undefined) node.clipsContent = opts.clipsContent;
  if (opts.padding !== undefined) applyPadding(node, opts.padding);

  if (opts.direction !== "NONE") {
    node.itemSpacing = opts.spacing ?? 0;
    const isHorizontal = opts.direction === "HORIZONTAL";
    node.primaryAxisSizingMode =
      (isHorizontal ? opts.width : opts.height) !== undefined ? "FIXED" : "AUTO";
    node.counterAxisSizingMode =
      (isHorizontal ? opts.height : opts.width) !== undefined ? "FIXED" : "AUTO";
  }

  if (opts.width !== undefined || opts.height !== undefined) {
    node.resize(opts.width ?? node.width, opts.height ?? node.height);
  }

  if (opts.border) {
    node.strokes = [{ type: "SOLID", color: opts.border.color }];
    node.strokeWeight = opts.border.width ?? 1;
    node.strokeAlign = "CENTER";
  }
}

export function createAutoLayoutFrame(opts: AutoLayoutOpts): FrameNode {
  const frame = figma.createFrame();
  applyAutoLayout(frame, opts);
  return frame;
}

export function createAutoLayoutComponent(opts: AutoLayoutOpts): ComponentNode {
  const component = figma.createComponent();
  applyAutoLayout(component, opts);
  return component;
}

export function createText(opts: {
  characters: string;
  font: { family: string; style: string; size: number };
  color?: RGB;
  lineHeight?: number;
  letterSpacing?: number;
  width?: number;
}): TextNode {
  const node = figma.createText();
  node.fontName = { family: opts.font.family, style: opts.font.style };
  node.fontSize = opts.font.size;

  if (opts.lineHeight !== undefined) {
    node.lineHeight = { value: opts.lineHeight * 100, unit: "PERCENT" };
  }
  if (opts.letterSpacing !== undefined) {
    node.letterSpacing = { value: opts.letterSpacing, unit: "PIXELS" };
  }

  node.characters = opts.characters;
  node.fills = [{ type: "SOLID", color: opts.color ?? specTokens.themes.light.text }];

  if (opts.width !== undefined) {
    node.textAutoResize = "HEIGHT";
    node.resize(opts.width, node.height);
  }

  return node;
}

export function createTokenChip(opts: {
  label: string;
  background: RGB;
  textColor?: RGB;
  width?: number;
}): FrameNode {
  const frame = createAutoLayoutFrame({
    name: "token",
    direction: "VERTICAL",
    padding: { top: 4, right: 5, bottom: 4, left: 5 },
    fill: opts.background,
    cornerRadius: 2,
    height: 24,
    width: opts.width,
  });

  const text = createText({
    characters: opts.label,
    font: specTokens.fonts.code,
    color: opts.textColor ?? specTokens.themes.light.text,
    lineHeight: 1.3,
    letterSpacing: 0.1875,
  });
  text.textAutoResize = "WIDTH_AND_HEIGHT";

  frame.appendChild(text);
  return frame;
}

export function createColorSwatch(opts: {
  color: RGB;
  size?: number;
  cornerRadius?: number;
  inverse?: boolean;
}): FrameNode {
  const size = opts.size ?? 40;
  const frame = figma.createFrame();
  frame.name = "swatch";
  frame.resize(size, size);
  frame.fills = [{ type: "SOLID", color: opts.color }];
  frame.cornerRadius = opts.cornerRadius ?? 2;
  frame.strokes = [{
    type: "SOLID",
    color: opts.inverse ? rgb(1, 1, 1) : rgb(0, 0, 0),
    opacity: 0.1,
  }];
  frame.strokeWeight = 1;
  frame.strokeAlign = "INSIDE";
  return frame;
}

export function createTableCell(opts: {
  variant: "text" | "header" | "token";
  theme?: SpecTheme;
  swatch?: boolean;
  text?: string;
  chipLabel?: string;
  chipBackground?: RGB;
  swatchColor?: RGB;
}): FrameNode {
  const theme = opts.theme ?? specTokens.themes.light;
  const border = { color: theme.cellBorder };
  const isTokenSwatch = opts.variant === "token" && opts.swatch;

  if (isTokenSwatch) {
    const frame = createAutoLayoutFrame({
      name: "table-cell",
      direction: "HORIZONTAL",
      padding: { top: 12, right: 20, bottom: 16, left: 20 },
      fill: theme.cellFill,
      width: 240,
      height: 72,
      border,
    });
    frame.primaryAxisAlignItems = "SPACE_BETWEEN";
    frame.counterAxisAlignItems = "MIN";

    frame.appendChild(createTokenChip({
      label: opts.chipLabel ?? "",
      background: opts.chipBackground ?? theme.chipBg,
      textColor: theme.text,
    }));
    frame.appendChild(createColorSwatch({
      color: opts.swatchColor ?? rgb(0, 0, 0),
      inverse: theme.cellFill.r < 0.5,
    }));
    return frame;
  }

  const isTextSwatch = opts.variant === "text" && opts.swatch;
  const height = isTextSwatch ? 72 : 56;

  const frame = createAutoLayoutFrame({
    name: "table-cell",
    direction: "HORIZONTAL",
    spacing: opts.variant === "token" ? 8 : 0,
    padding: { top: 12, right: 20, bottom: 16, left: 20 },
    fill: theme.cellFill,
    width: 240,
    height,
    border,
  });

  if (isTextSwatch) {
    frame.primaryAxisAlignItems = "SPACE_BETWEEN";
    frame.counterAxisAlignItems = "MIN";

    const label = createText({
      characters: opts.text ?? "",
      font: specTokens.fonts.body,
      color: theme.text,
      lineHeight: 1.5,
      width: 144,
    });
    frame.appendChild(label);

    const swatch = createColorSwatch({
      color: opts.swatchColor ?? rgb(0, 0, 0),
      inverse: theme.cellFill.r < 0.5,
    });
    frame.appendChild(swatch);
    return frame;
  }

  if (opts.variant === "token") {
    const chip = createTokenChip({
      label: opts.chipLabel ?? "",
      background: opts.chipBackground ?? theme.chipBg,
      textColor: theme.text,
    });
    frame.appendChild(chip);
    return frame;
  }

  // "text" and "header" variants
  const isBold = opts.variant === "header";
  const label = createText({
    characters: opts.text ?? "",
    font: isBold ? specTokens.fonts.bodyBold : specTokens.fonts.body,
    color: theme.text,
    lineHeight: 1.5,
    letterSpacing: isBold ? -0.084 : undefined,
  });
  label.layoutGrow = 1;
  label.textAutoResize = "HEIGHT";
  frame.appendChild(label);

  return frame;
}

export function createTableHeader(opts: {
  variant: "header" | "subheader";
  theme?: SpecTheme;
  title?: string;
}): FrameNode {
  const theme = opts.theme ?? specTokens.themes.light;
  const title = opts.title ?? "";

  if (opts.variant === "header") {
    const frame = createAutoLayoutFrame({
      name: "table-header",
      direction: "NONE",
      width: 960,
      height: 160,
      fill: theme.headerFill,
    });

    const text = createText({
      characters: title,
      font: specTokens.fonts.heading,
      color: theme.headingText,
      lineHeight: 1.1,
      letterSpacing: -1.92,
    });
    frame.appendChild(text);
    text.x = 20;
    text.y = 16;
    return frame;
  }

  // subheader
  const frame = createAutoLayoutFrame({
    name: "table-subheader",
    direction: "VERTICAL",
    padding: { top: 55, right: 20, bottom: 16, left: 20 },
    fill: theme.subheaderFill,
    width: 960,
  });

  const text = createText({
    characters: title,
    font: specTokens.fonts.subheading,
    color: theme.headingText,
    lineHeight: 1.4,
    letterSpacing: -0.24,
  });
  frame.appendChild(text);
  return frame;
}
