// Drag-selection assist for the editor's text fields.
//
// Chromium quirk: a drag-selection started inside an <input>/<textarea> stops
// EXTENDING the moment the pointer leaves the field when the field sits inside a
// flex/grid ancestor chain (the whole editor column is one — verified by bisection:
// the same field in a plain block chain clamps natively to its start/end). The
// selection collapses to a caret instead, so a sweep that overshoots the field's
// edge, which is how most people select-to-copy, appears to "not work".
//
// This assist restores the native plain-page feel: while the primary button is held
// after a press in one of our fields, pointer positions OUTSIDE the field extend the
// selection from the press anchor to the field's start/end in the drag direction.
// Inside the field, the browser's native selection handles everything untouched.
const FIELD_SELECTOR = 'input.edit-input, textarea.edit-desc-list-item, textarea.edit-input-description';

export function installSelectionAssist() {
    let field = null;
    let anchor = 0;

    document.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || !e.target.matches?.(FIELD_SELECTOR)) {
            field = null;
            return;
        }
        field = e.target;
        // The browser places the caret as part of pointerdown's default action, which
        // runs after this capture listener — read the anchor on the next frame.
        requestAnimationFrame(() => {
            if (field) anchor = field.selectionStart ?? 0;
        });
    }, true);

    // Extend from the anchor to the field's start/end based on where the pointer is.
    const clamp = (f, x, y) => {
        const r = f.getBoundingClientRect();
        const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        if (inside) return false; // native selection owns the gesture inside the field
        // Below the field, or beside it past the right edge → extend anchor..end;
        // above it, or past the left edge → extend start..anchor (focus at the start).
        const toEnd = y > r.bottom || (y >= r.top && x > r.right);
        if (toEnd) f.setSelectionRange(anchor, f.value.length);
        else f.setSelectionRange(0, anchor, 'backward');
        return true;
    };

    document.addEventListener('pointermove', (e) => {
        if (!field || !(e.buttons & 1)) return;
        clamp(field, e.clientX, e.clientY);
    }, true);

    document.addEventListener('pointerup', (e) => {
        const f = field;
        field = null;
        if (!f) return;
        // During a live drag the browser's native selection machinery re-collapses
        // whatever the move handler set. Re-apply once AFTER it has fully finished.
        const x = e.clientX, y = e.clientY;
        setTimeout(() => clamp(f, x, y), 0);
    }, true);
}
