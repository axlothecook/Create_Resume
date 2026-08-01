// Vitest setup: adds jest-dom matchers (toBeInTheDocument, toHaveAttribute, ...)
// and clears the DOM between tests.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom does not implement window.matchMedia, and anything that renders the editor
// (SavedDocsRail) calls it. Without this the component throws on render, which looks
// like a failing assertion rather than a missing browser API. `matches: false` puts
// tests on the desktop side of every media query, matching the default viewport.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},    // deprecated, kept for older callers
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Also missing from jsdom, and used by AnimatedHeight (which the editor renders). A
// no-op is the right stub: it exists to measure a real layout, and jsdom has none, so
// there is nothing meaningful to report. Components fall back to their un-animated
// state, which is what tests should assert against anyway.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

afterEach(() => {
  cleanup();
});
