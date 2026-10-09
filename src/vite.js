// Vite config for a Figma plugin: `src/index.html` and `src/code.ts` in, and
// `dist/index.html`, `dist/code.js` and `dist/manifest.json` out.
//
// Two builds, one per thread: the UI (`vite build`) and the sandbox
// (`vite build --mode code`). Built together, a module both import becomes a
// shared chunk, and code.js starts with an `import` Figma's sandbox can't load
// ("expecting '('"). Apart, each is one self-contained file, so the threads can
// share code, such as lib/scale.
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Figma's JS sandbox doesn't support ES2020+ (no ?. or ??)
const TARGET = "es2017";

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Bundles figma-ui3-kit-svelte's SVG imports as strings, for its icons.
 * @returns {import("vite").Plugin}
 */
export function ui3InlineSvg() {
  return {
    name: "ui3-inline-svg",
    enforce: "pre",
    load(id) {
      if (!id.includes("figma-ui3-kit-svelte")) return;
      const filePath = id.split("?")[0];
      if (!filePath.endsWith(".svg")) return;
      const svg = readFileSync(filePath, "utf-8");
      return `export default ${JSON.stringify(svg)};`;
    },
  };
}

/**
 * Inlines the UI build's CSS and JS into one `index.html`, as Figma needs, and
 * copies `src/manifest.json` to the output.
 *
 * Replacements are functions, so a `$&` in minified code isn't read as a
 * pattern.
 * @param {{ root: string, moduleScript?: boolean }} options
 * @returns {import("vite").Plugin}
 */
export function inlineFigmaHtml({ root, moduleScript = false }) {
  const scriptTag = moduleScript ? '<script type="module">' : "<script>";
  return {
    name: "inline-figma-html",
    apply: "build",
    enforce: "post",
    generateBundle(_options, bundle) {
      const htmlKey =
        Object.keys(bundle).find((key) => key.endsWith("index.html")) ?? "";
      const htmlAsset = htmlKey ? bundle[htmlKey] : undefined;
      if (!htmlAsset || htmlAsset.type !== "asset") return;

      let html = String(htmlAsset.source);
      html = html.replace(/<link\s+[^>]*rel=["']modulepreload["'][^>]*>/gi, "");

      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type !== "asset" || !fileName.endsWith(".css")) continue;
        const css = String(asset.source ?? "");
        const hrefPattern = new RegExp(
          `<link[^>]+rel=["']stylesheet["'][^>]+href=["'](?:\\./|/|\\.\\./)?${escapeRegExp(
            fileName,
          )}["'][^>]*>`,
          "i",
        );
        if (hrefPattern.test(html)) {
          html = html.replace(hrefPattern, () => `<style>${css}</style>`);
          delete bundle[fileName];
        }
      }

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== "chunk") continue;
        const scriptPattern = new RegExp(
          `<script[^>]+src=["'](?:\\./|/|\\.\\./)?${escapeRegExp(
            fileName,
          )}["'][^>]*></script>`,
          "i",
        );
        if (scriptPattern.test(html)) {
          html = html.replace(
            scriptPattern,
            () => `${scriptTag}${chunk.code}</script>`,
          );
          delete bundle[fileName];
        }
      }

      htmlAsset.source = html;
      if (htmlKey !== "index.html") {
        delete bundle[htmlKey];
        htmlAsset.fileName = "index.html";
        bundle["index.html"] = htmlAsset;
      }

      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: readFileSync(resolve(root, "src/manifest.json"), "utf-8"),
      });
    },
  };
}

/**
 * The plugin's Vite config, for `vite.config.ts`:
 *
 *   export default figmaPluginConfig(import.meta.url);
 *
 * Build with `vite build && vite build --mode code`.
 *
 * `moduleScript` inlines the UI as `<script type="module">`, which runs once
 * the page is parsed. Without it the script is classic and runs in `<head>`,
 * so `main.js` waits for DOMContentLoaded before it mounts.
 * @param {string} configUrl `import.meta.url` of the plugin's vite.config.ts
 * @param {{ moduleScript?: boolean }} [options]
 * @returns {import("vite").UserConfigFnObject}
 */
export function figmaPluginConfig(configUrl, { moduleScript = false } = {}) {
  const root = dirname(fileURLToPath(configUrl));
  return ({ mode }) =>
    mode === "code"
      ? {
          base: "./",
          build: {
            outDir: "dist",
            emptyOutDir: false, // The UI build's index.html and manifest.json stay
            target: TARGET,
            rollupOptions: {
              input: resolve(root, "src/code.ts"),
              output: {
                entryFileNames: "code.js",
                inlineDynamicImports: true,
              },
            },
          },
        }
      : {
          base: "./",
          plugins: [
            ui3InlineSvg(),
            svelte(),
            inlineFigmaHtml({ root, moduleScript }),
          ],
          build: {
            outDir: "dist",
            emptyOutDir: false, // The sandbox build's code.js stays
            target: TARGET,
            rollupOptions: {
              input: resolve(root, "src/index.html"),
              output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name]-[hash].js",
                assetFileNames: "[name]-[hash][extname]",
              },
            },
          },
        };
}
