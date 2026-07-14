// Shared formatting helpers used by BOTH résumé render paths (the on-screen demo
// components and the PDF document). Keeping them here stops the two paths drifting.

const pad = (n) => String(n).padStart(2, '0');

// Today as "DD/MM/YYYY". Kept ONLY so old saved résumés (which encoded "ongoing" by
// storing today's date) still render "present" — see the legacy note in
// formatResumeDate. New entries use the explicit `ongoing` flag instead.
export const todayString = () => {
  const t = new Date();
  return `${pad(t.getDate())}/${pad(t.getMonth() + 1)}/${t.getFullYear()}`;
};

// The word an ongoing entry shows in place of an end date (both render paths).
export const ONGOING_LABEL = 'present';

// Format a stored date value as "MM/YYYY".
// A value can arrive in THREE shapes and all must work:
//  1. a legacy "MM/YYYY" string (the seed/example data) — passed through;
//  2. a LIVE dayjs object (fresh from the MUI picker, before any save) — read via
//     its $D/$M/$y fields;
//  3. an ISO string (what a dayjs object becomes after the JSON round-trip through
//     save → Mongo → load). This case used to render "NaN/undefined" in the demo
//     and the raw ISO string in the PDF.
//
// LEGACY "ongoing": entries saved before the `ongoing` checkbox encoded it as "the end
// date IS today", so the label only held for one day — the same résumé silently read
// "07/2026" the next morning. That comparison is kept so those old entries still show
// "present" today, but an entry marked ongoing now never reaches this function (the
// callers short-circuit on item.ongoing).
export const formatResumeDate = (value, today = todayString()) => {
  if (!value) return '';
  if (typeof value === 'string' && /^\d\d\/\d\d\d\d$/.test(value)) return value;
  // live dayjs object from the picker
  if (typeof value === 'object' && typeof value.$y === 'number') {
    const entered = `${pad(value.$D)}/${pad(value.$M + 1)}/${value.$y}`;
    if (entered === today) return ONGOING_LABEL;
    return `${pad(value.$M + 1)}/${value.$y}`;
  }
  // ISO string (JSON round-trip) or anything else Date can parse
  const dt = new Date(value);
  if (!Number.isNaN(dt.getTime())) {
    const entered = `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;
    if (entered === today) return ONGOING_LABEL;
    return `${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;
  }
  return '';
};

// The end-date text for an entry: "present" when the ongoing flag is set, else the
// formatted end date. Used by BOTH render paths so they can't drift.
export const formatEndDate = (item, today = todayString()) =>
  item?.ongoing ? ONGOING_LABEL : formatResumeDate(item?.endDate, today);

// Normalize a user-typed link into a real absolute URL for use as an href.
// Without this, "www.foo.com" is treated as a RELATIVE path and resolves to
// ourdomain.com/www.foo.com (broken) in the demo — and the PDF's <Link> would
// do the same.
export const toHref = (text) => {
  if (!text) return '';
  const trimmed = String(text).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};
