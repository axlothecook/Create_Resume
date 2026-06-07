// Shared password rules for the auth screen. Keep these in sync with the backend
// validator (Create_Resume-backend/src/middleware/validate.js signupRules).
//
// Rules (medium strength): at least 8 chars, at least one letter, at least one
// number. Banned: spaces and ASCII/Unicode control characters.

// "Clean" = no whitespace (spaces/tabs/newlines) and no control characters.
// Checked by codepoint so the source needs no literal control chars: every char
// must be printable (code >= 0x20) and not DEL/C1 (0x7F-0x9F).
function isClean(p) {
    for (let i = 0; i < p.length; i++) {
        const c = p.charCodeAt(i);
        if (c <= 0x20) return false;            // space (0x20) + C0 control chars
        if (c >= 0x7f && c <= 0x9f) return false; // DEL + C1 control chars
    }
    return true;
}

// Each rule: a label (shown in the checklist) + a test against the password.
export const PASSWORD_RULES = [
    { key: 'length', label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { key: 'letter', label: 'Contains a letter', test: (p) => /[a-zA-Z]/.test(p) },
    { key: 'number', label: 'Contains a number', test: (p) => /[0-9]/.test(p) },
    { key: 'noSpace', label: 'No spaces or invalid characters', test: (p) => p.length > 0 && isClean(p) },
];

// Evaluate every rule into [{ key, label, passed }]. noSpace shows as failing while
// empty so it does not read as done before the user types anything.
export function evaluatePassword(password) {
    return PASSWORD_RULES.map((r) => ({ key: r.key, label: r.label, passed: r.test(password) }));
}

// True only when every rule passes.
export function isPasswordValid(password) {
    return PASSWORD_RULES.every((r) => r.test(password));
}
