import type { Plugin, UserConfigFnObject } from "vite";

export function ui3InlineSvg(): Plugin;

export function inlineFigmaHtml(options: {
  root: string;
  moduleScript?: boolean;
}): Plugin;

export function figmaPluginConfig(
  configUrl: string,
  options?: { moduleScript?: boolean },
): UserConfigFnObject;
