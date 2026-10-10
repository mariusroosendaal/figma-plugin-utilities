import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // figma/mockup/examples are use_figma snippets, not modules: they end in a
  // top-level `return`, which only parses inside the wrapper use_figma adds.
  { ignores: ["dist/**", "node_modules/**", "figma/mockup/examples/**"] },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, figma: "readonly" } },
  },
  ...svelte.configs["flat/recommended"],
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".svelte"],
      },
      globals: { ...globals.browser, figma: "readonly" },
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: config.files ?? ["**/*.{ts,tsx,mts,cts}"],
  })),
]);
