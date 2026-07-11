// Shared formatting helpers used by BOTH résumé render paths (the on-screen demo
// components and the PDF document). Keeping them here stops the two paths drifting.

const pad = (n) => String(n).padStart(2, '0');

// Today as "DD/MM/YYYY" — the convention the "choose today's date for ongoing"
// check compares against.
export const todayString = () => {
  const t = new Date();
  return `${pad(t.getDate())}/${pad(t.getMonth() + 1)}/${t.getFullYear()}`;
};

// Format a stored date value as "MM/YYYY" (or "present" when it equals today).
// A value can arrive in THREE shapes and all must work:
//  1. a legacy "MM/YYYY" string (the seed/example data) — passed through;
//  2. a LIVE dayjs object (fresh from the MUI picker, before any save) — read via
//     its $D/$M/$y fields;
//  3. an ISO string (what a dayjs object becomes after the JSON round-trip through
//     save → Mongo → load). This case used to render "NaN/undefined" in the demo
//     and the raw ISO string in the PDF.
export const formatResumeDate = (value, today = todayString()) => {
  if (!value) return '';
  if (typeof value === 'string' && /^\d\d\/\d\d\d\d$/.test(value)) return value;
  // live dayjs object from the picker
  if (typeof value === 'object' && typeof value.$y === 'number') {
    const entered = `${pad(value.$D)}/${pad(value.$M + 1)}/${value.$y}`;
    if (entered === today) return 'present';
    return `${pad(value.$M + 1)}/${value.$y}`;
  }
  // ISO string (JSON round-trip) or anything else Date can parse
  const dt = new Date(value);
  if (!Number.isNaN(dt.getTime())) {
    const entered = `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;
    if (entered === today) return 'present';
    return `${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;
  }
  return '';
};

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
