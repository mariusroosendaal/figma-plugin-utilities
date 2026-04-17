/**
 * Auto-resize utilities for Figma plugin windows
 *
 * Usage in UI:
 *   import { resizeToFit, autoResize } from "figma-plugin-utilities";
 *   resizeToFit(); // One-time resize
 *   autoResize();  // Watch for changes and auto-resize
 *
 * Usage in code.ts:
 *   import { handleResize } from "figma-plugin-utilities/lib/figma-helpers";
 *   // In your message handler:
 *   if (msg.type === "resize") handleResize(msg);
 */

import { sendToPlugin } from "./messages.js";

/** Default width for the plugin window */
let defaultWidth = 300;

/**
 * Set the default width used for resize operations
 * @param {number} width - The default width in pixels
 */
export function setDefaultWidth(width) {
  defaultWidth = width;
}

/**
 * Get the current content height of the plugin UI
 * Uses scrollHeight which works when container doesn't have fixed height
 * @param {HTMLElement} [container] - Container element to measure (should NOT have height: 100%)
 * @returns {number} The content height in pixels
 */
export function getContentHeight(container) {
  if (!container) {
    return 0;
  }
  return container.scrollHeight;
}

/**
 * Request the plugin to resize to fit content
 * @param {object} [options] - Resize options
 * @param {number} [options.width] - Width in pixels (uses default if not specified)
 * @param {number} [options.height] - Height in pixels (auto-calculated if not specified)
 * @param {number} [options.minHeight=100] - Minimum height in pixels
 * @param {number} [options.maxHeight=800] - Maximum height in pixels
 * @param {number} [options.padding=0] - Extra padding to add to calculated height
 * @param {HTMLElement} [options.container] - Container element to measure
 */
export function resizeToFit(options = {}) {
  const {
    width = defaultWidth,
    height,
    minHeight = 100,
    maxHeight = 800,
    padding = 0,
    container = document.body,
  } = options;

  let finalHeight = height;

  if (finalHeight === undefined) {
    finalHeight = getContentHeight(container) + padding;
  }

  // Clamp to min/max
  finalHeight = Math.max(minHeight, Math.min(maxHeight, finalHeight));

  sendToPlugin("resize", { width, height: finalHeight });
}

/**
 * Set up automatic resizing when content changes
 * Uses ResizeObserver to watch for size changes
 * 
 * IMPORTANT: The container element must NOT have height: 100% or fixed height.
 * Use bind:this on a wrapper element that flows naturally with content.
 * 
 * @param {object} options - Auto-resize options
 * @param {HTMLElement} options.container - Container element to observe (required, must not have fixed height)
 * @param {number} [options.width] - Width in pixels (uses default if not specified)
 * @param {number} [options.minHeight=100] - Minimum height in pixels
 * @param {number} [options.maxHeight=800] - Maximum height in pixels
 * @param {number} [options.padding=0] - Extra padding to add to calculated height
 * @param {number} [options.debounce=50] - Debounce delay in milliseconds
 * @param {number} [options.threshold=20] - Minimum height change to trigger resize (prevents position reset)
 * @returns {function} Cleanup function to stop observing
 */
export function autoResize(options = {}) {
  const {
    container,
    width = defaultWidth,
    minHeight = 100,
    maxHeight = 800,
    padding = 0,
    debounce = 50,
    threshold = 20,
  } = options;

  if (!container) {
    console.warn("autoResize: container is required");
    return () => {};
  }

  let timeoutId = null;
  let lastHeight = 0;

  const doResize = () => {
    const newHeight = getContentHeight(container) + padding;
    const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

    // Only resize if height changed by more than threshold (prevents position reset on small changes)
    const heightDiff = Math.abs(clampedHeight - lastHeight);
    if (lastHeight === 0 || heightDiff >= threshold) {
      lastHeight = clampedHeight;
      sendToPlugin("resize", { width, height: clampedHeight });
    }
  };

  const debouncedResize = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(doResize, debounce);
  };

  // Initial resize
  doResize();

  // Watch for changes
  const observer = new ResizeObserver(debouncedResize);
  observer.observe(container);

  // Also watch for DOM mutations (new elements added/removed)
  const mutationObserver = new MutationObserver(debouncedResize);
  mutationObserver.observe(container, {
    childList: true,
    subtree: true,
    attributes: true,
  });

  // Return cleanup function
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
    observer.disconnect();
    mutationObserver.disconnect();
  };
}
