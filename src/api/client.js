// Thin wrapper around the backend API. Always sends the session cookie
// (credentials: 'include'); base URL comes from VITE_API_URL (dev default :3006).
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

async function request(path, { method = 'GET', body } = {}) {
    let res;
    try {
        res = await fetch(`${BASE}${path}`, {
            method,
            credentials: 'include',
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        // fetch() rejects (TypeError "Failed to fetch") when the request never reached
        // the server — no connection, or a VPN / ad-blocker / privacy-DNS / strict
        // cross-site-tracking setting blocked it. Replace the cryptic browser message
        // with something the user can act on.
        const err = new Error(
            "Couldn't reach the server. Check your internet connection, and if you're using a VPN, ad-blocker, or private DNS, try turning it off."
        );
        err.network = true;
        throw err;
    }
    let data = null;
    try { data = await res.json(); } catch { /* empty body */ }
    if (!res.ok) {
        const err = new Error((data && data.error) || `Request failed (${res.status})`);
        err.status = res.status;
        err.details = data && data.details;
        throw err;
    }
    return data;
}

export const api = {
    // --- auth ---
    me: () => request('/auth/me'),
    signup: (email, username, password) => request('/auth/signup', { method: 'POST', body: { email, username, password } }),
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    logout: () => request('/auth/logout', { method: 'POST' }),

    // --- résumés (used in the saved-docs slice) ---
    listResumes: () => request('/resumes'),
    getResume: (id) => request(`/resumes/${id}`),
    createResume: (title, data) => request('/resumes', { method: 'POST', body: { title, data } }),
    updateResume: (id, payload) => request(`/resumes/${id}`, { method: 'PUT', body: payload }),
    deleteResume: (id) => request(`/resumes/${id}`, { method: 'DELETE' }),
};
