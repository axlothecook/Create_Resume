import { describe, it, expect } from 'vitest';
import { formatResumeDate, toHref, todayString } from './resumeFormat';

// A fixed "today" so the present-date branch is deterministic (not dependent on
// the real clock). Matches the "DD/MM/YYYY" shape todayString() produces.
const TODAY = '15/06/2026';

describe('formatResumeDate', () => {
  it('returns empty string for empty/nullish input', () => {
    expect(formatResumeDate('', TODAY)).toBe('');
    expect(formatResumeDate(null, TODAY)).toBe('');
    expect(formatResumeDate(undefined, TODAY)).toBe('');
  });

  it('passes a legacy MM/YYYY string through unchanged', () => {
    expect(formatResumeDate('08/2019', TODAY)).toBe('08/2019');
    expect(formatResumeDate('12/2025', TODAY)).toBe('12/2025');
  });

  it('formats a live dayjs-shaped object to MM/YYYY', () => {
    // dayjs objects expose $D (day), $M (0-based month), $y (year).
    const dayjsLike = { $D: 3, $M: 0, $y: 2025 }; // 3 Jan 2025
    expect(formatResumeDate(dayjsLike, TODAY)).toBe('01/2025');
  });

  it('formats an ISO string (the JSON round-trip case) to MM/YYYY, not NaN', () => {
    // This is the exact bug that rendered "NaN/undefined" after loading a saved CV.
    const iso = '2025-03-10T00:00:00.000Z';
    expect(formatResumeDate(iso, TODAY)).toBe('03/2025');
  });

  it('returns "present" when the date equals today', () => {
    const dayjsToday = { $D: 15, $M: 5, $y: 2026 }; // 15 Jun 2026 == TODAY
    expect(formatResumeDate(dayjsToday, TODAY)).toBe('present');
  });

  it('returns empty string for an unparseable value', () => {
    expect(formatResumeDate('not a date', TODAY)).toBe('');
  });
});

describe('toHref', () => {
  it('returns empty string for empty input', () => {
    expect(toHref('')).toBe('');
    expect(toHref(null)).toBe('');
  });

  it('prefixes https:// onto a protocol-less URL', () => {
    // The bug: "www.foo.com" resolved as a relative path without this.
    expect(toHref('www.foo.com')).toBe('https://www.foo.com');
    expect(toHref('portfolio.axlothecook.com')).toBe('https://portfolio.axlothecook.com');
  });

  it('leaves an absolute http(s) URL untouched', () => {
    expect(toHref('https://foo.com')).toBe('https://foo.com');
    expect(toHref('http://foo.com')).toBe('http://foo.com');
  });

  it('trims surrounding whitespace before deciding', () => {
    expect(toHref('  www.foo.com  ')).toBe('https://www.foo.com');
  });
});

describe('todayString', () => {
  it('returns a DD/MM/YYYY string', () => {
    expect(todayString()).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });
});
