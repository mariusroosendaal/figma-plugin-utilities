export type PaddingSpec =
  number | { top?: number; right?: number; bottom?: number; left?: number };

export type SpecTheme = {
  cellFill: RGB;
  cellBorder: RGB;
  text: RGB;
  chipBg: RGB;
  headerFill: RGB;
  subheaderFill: RGB;
  headingText: RGB;
};

export type NodeKind = "frame" | "component";
export type NodeFor<K extends NodeKind> = K extends "component"
  ? ComponentNode
  : FrameNode;

function rgb(r: number, g: number, b: number): RGB {
  return { r, g, b };
}

function createNode<K extends NodeKind>(as?: K): NodeFor<K> {
  return (
    as === "component" ? figma.createComponent() : figma.createFrame()
  ) as NodeFor<K>;
}

function applyPadding(
  frame: FrameNode | ComponentNode,
  spec: PaddingSpec,
): void {
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
    green: rgb(0.251, 0.769, 0.349), // #40C459 — AAA
    blue: rgb(0.412, 0.671, 1.0), // #69ABFF — AA
    purple: rgb(0.71, 0.522, 0.973), // #B585F8 — AA18
    red: rgb(1.0, 0.482, 0.467), // #FF7B77 — DNP
  },
  fonts: {
    body: { family: "Inter", style: "Regular", size: 14 },
    bodyBold: { family: "Inter", style: "Semi Bold", size: 14 },
    subheading: { family: "Inter", style: "Medium", size: 24 },
    heading: { family: "Inter", style: "Regular", size: 48 },
    code: { family: "IBM Plex Mono", style: "Regular", size: 12 },
  },
  themes: {
    light: {
      cellFill: rgb(1.0, 1.0, 1.0),
      cellBorder: rgb(0.949, 0.949, 0.949),
      text: rgb(0.102, 0.102, 0.102),
      chipBg: rgb(0.949, 0.949, 0.949),
      headerFill: rgb(1.0, 1.0, 1.0),
      subheaderFill: rgb(0.961, 0.961, 0.961),
      headingText: rgb(0.0, 0.0, 0.0),
    } satisfies SpecTheme,
    dark: {
      cellFill: rgb(0.102, 0.102, 0.102),
      cellBorder: rgb(0.133, 0.133, 0.133),
      text: rgb(1.0, 1.0, 1.0),
      chipBg: rgb(0.2, 0.2, 0.2),
      headerFill: rgb(0.0, 0.0, 0.0),
      subheaderFill: rgb(0.0, 0.0, 0.0),
      headingText: rgb(1.0, 1.0, 1.0),
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

function applyAutoLayout(
  node: FrameNode | ComponentNode,
  opts: AutoLayoutOpts,
): void {
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
      (isHorizontal ? opts.width : opts.height) !== undefined
        ? "FIXED"
        : "AUTO";
    node.counterAxisSizingMode =
      (isHorizontal ? opts.height : opts.width) !== undefined
        ? "FIXED"
        : "AUTO";
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
  node.fills = [
    { type: "SOLID", color: opts.color ?? specTokens.themes.light.text },
  ];

  if (opts.width !== undefined) {
    node.textAutoResize = "HEIGHT";
    node.resize(opts.width, node.height);
  }

  return node;
}

export function createTokenChip<K extends NodeKind = "frame">(opts: {
  label: string;
  background: RGB;
  textColor?: RGB;
  width?: number;
  as?: K;
}): NodeFor<K> {
  const node = createNode(opts.as);
  applyAutoLayout(node, {
    name: "token",
    direction: "VERTICAL",
    padding: { top: 4, right: 8, bottom: 4, left: 8 },
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
  text.name = "label";
  text.textAutoResize = "WIDTH_AND_HEIGHT";
  node.appendChild(text);
  return node as NodeFor<K>;
}

export function createColorSwatch<K extends NodeKind = "frame">(opts: {
  color: RGB;
  size?: number;
  cornerRadius?: number;
  inverse?: boolean;
  as?: K;
}): NodeFor<K> {
  const size = opts.size ?? 40;
  const node = createNode(opts.as);
  applyAutoLayout(node, {
    name: "swatch",
    direction: "NONE",
    fill: opts.color,
    cornerRadius: opts.cornerRadius ?? 2,
    width: size,
    height: size,
  });
  node.strokes = [
    {
      type: "SOLID",
      color: opts.inverse ? rgb(1, 1, 1) : rgb(0, 0, 0),
      opacity: 0.1,
    },
  ];
  node.strokeWeight = 1;
  node.strokeAlign = "INSIDE";
  return node as NodeFor<K>;
}

function chipOrInstance(
  source: ComponentNode | undefined,
  label: string,
  background: RGB,
  textColor: RGB,
): FrameNode | InstanceNode {
  if (source) return source.createInstance();
  return createTokenChip({ label, background, textColor });
}

function swatchOrInstance(
  source: ComponentNode | undefined,
  color: RGB,
  inverse: boolean,
): FrameNode | InstanceNode {
  if (source) return source.createInstance();
  return createColorSwatch({ color, inverse });
}

export function createTableCell<K extends NodeKind = "frame">(opts: {
  variant: "text" | "header" | "token";
  theme?: SpecTheme;
  swatch?: boolean;
  text?: string;
  chipLabel?: string;
  chipBackground?: RGB;
  swatchColor?: RGB;
  chipSource?: ComponentNode;
  swatchSource?: ComponentNode;
  width?: number;
  height?: number;
  textSizing?: "fill" | "hug";
  as?: K;
}): NodeFor<K> {
  const theme = opts.theme ?? specTokens.themes.light;
  const border = { color: theme.cellBorder };
  const isTokenSwatch = opts.variant === "token" && opts.swatch;

  if (isTokenSwatch) {
    const node = createNode(opts.as);
    applyAutoLayout(node, {
      name: "table-cell",
      direction: "HORIZONTAL",
      padding: { top: 12, right: 20, bottom: 16, left: 20 },
      fill: theme.cellFill,
      width: opts.width ?? 240,
      height: opts.height ?? 72,
      border,
    });
    node.primaryAxisAlignItems = "SPACE_BETWEEN";
    node.counterAxisAlignItems = "MIN";
    node.appendChild(
      chipOrInstance(
        opts.chipSource,
        opts.chipLabel ?? "",
        opts.chipBackground ?? theme.chipBg,
        theme.text,
      ),
    );
    node.appendChild(
      swatchOrInstance(
        opts.swatchSource,
        opts.swatchColor ?? rgb(0, 0, 0),
        theme.cellFill.r < 0.5,
      ),
    );
    return node as NodeFor<K>;
  }

  const isTextSwatch = opts.variant === "text" && opts.swatch;
  const defaultHeight = isTextSwatch ? 72 : 56;

  const node = createNode(opts.as);
  applyAutoLayout(node, {
    name: "table-cell",
    direction: "HORIZONTAL",
    spacing: opts.variant === "token" ? 8 : 0,
    padding: { top: 12, right: 20, bottom: 16, left: 20 },
    fill: theme.cellFill,
    width: opts.width ?? 240,
    height: opts.height ?? defaultHeight,
    border,
  });

  if (isTextSwatch) {
    node.primaryAxisAlignItems = "SPACE_BETWEEN";
    node.counterAxisAlignItems = "MIN";
    const label = createText({
      characters: opts.text ?? "",
      font: specTokens.fonts.body,
      color: theme.text,
      lineHeight: 1.5,
      width: 144,
    });
    label.name = "text";
    node.appendChild(label);
    node.appendChild(
      swatchOrInstance(
        opts.swatchSource,
        opts.swatchColor ?? rgb(0, 0, 0),
        theme.cellFill.r < 0.5,
      ),
    );
    return node as NodeFor<K>;
  }

  if (opts.variant === "token") {
    node.appendChild(
      chipOrInstance(
        opts.chipSource,
        opts.chipLabel ?? "",
        opts.chipBackground ?? theme.chipBg,
        theme.text,
      ),
    );
    return node as NodeFor<K>;
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
  label.name = "text";
  if (opts.textSizing === "hug") {
    label.textAutoResize = "WIDTH_AND_HEIGHT";
  } else {
    label.layoutGrow = 1;
    label.textAutoResize = "HEIGHT";
  }
  node.appendChild(label);

  return node as NodeFor<K>;
}

export function createTableHeader<K extends NodeKind = "frame">(opts: {
  variant: "header" | "subheader";
  theme?: SpecTheme;
  title?: string;
  width?: number;
  height?: number;
  as?: K;
}): NodeFor<K> {
  const theme = opts.theme ?? specTokens.themes.light;
  const title = opts.title ?? "";

  if (opts.variant === "header") {
    const node = createNode(opts.as);
    applyAutoLayout(node, {
      name: "table-header",
      direction: "NONE",
      width: opts.width ?? 960,
      height: opts.height ?? 160,
      fill: theme.headerFill,
    });
    const text = createText({
      characters: title,
      font: specTokens.fonts.heading,
      color: theme.headingText,
      lineHeight: 1.1,
      letterSpacing: -1.92,
    });
    text.name = "title";
    node.appendChild(text);
    text.x = 20;
    text.y = 16;
    return node as NodeFor<K>;
  }

  // subheader
  const node = createNode(opts.as);
  applyAutoLayout(node, {
    name: "table-subheader",
    direction: "VERTICAL",
    padding: { top: 55, right: 20, bottom: 16, left: 20 },
    fill: theme.subheaderFill,
    width: opts.width ?? 960,
    height: opts.height,
  });
  const text = createText({
    characters: title,
    font: specTokens.fonts.subheading,
    color: theme.headingText,
    lineHeight: 1.4,
    letterSpacing: -0.24,
  });
  text.name = "heading";
  node.appendChild(text);
  return node as NodeFor<K>;
}
