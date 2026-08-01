import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Integration tests for App's auth GATING — which of the three screens (loading,
// AuthScreen, editor) is shown for a given combination of session state and URL.
//
// This is the seam a real bug lived in: `arrivedWithResetToken` was captured once at
// mount so the reset form would survive the token being stripped from the URL, but it
// was never cleared, so a successful login afterwards left the user stranded on the
// auth screen. The network showed login 200 / me 200 / resumes 200 — everything
// worked, the UI just never moved. The AuthScreen unit tests could not catch it
// because they render AuthScreen in isolation, without App deciding what to show.
//
// Only the API is mocked (the network boundary). The real AuthScreen and the real
// editor render, per Testing Library's guidance to avoid mocking child components:
// mocking them would test the mock, not the gate.
vi.mock('./api/client', () => ({
    api: {
        me: vi.fn(),
        login: vi.fn(),
        signup: vi.fn(),
        logout: vi.fn(),
        forgotPassword: vi.fn(),
        resetPassword: vi.fn(),
        listResumes: vi.fn(),
        getResume: vi.fn(),
        createResume: vi.fn(),
        updateResume: vi.fn(),
        deleteResume: vi.fn(),
    },
}));

import { api } from './api/client';
import App from './App';

const TOKEN = 'a'.repeat(64);
const USER = { id: 'u1', email: 'me@example.com', username: 'Me' };

// App reads the reset token from the URL at mount, so the URL is set per test.
function setUrl(path) {
    window.history.replaceState({}, '', path);
}

beforeEach(() => {
    vi.clearAllMocks();
    setUrl('/');
    // Signed out unless a test says otherwise; no saved documents to load.
    api.me.mockResolvedValue({ user: null });
    api.listResumes.mockResolvedValue([]);
    api.logout.mockResolvedValue({ ok: true });
});
afterEach(() => setUrl('/'));

// The auth card and the editor each have a landmark that only they render.
const authScreen = () => screen.queryByRole('heading', { name: /resume creator/i });
const editor = () => screen.queryByRole('button', { name: /clear resume/i });

describe('App auth gating', () => {
    test('signed out shows the auth screen, not the editor', async () => {
        render(<App />);
        await waitFor(() => expect(authScreen()).toBeInTheDocument());
        expect(editor()).not.toBeInTheDocument();
    });

    test('an existing session goes straight to the editor', async () => {
        api.me.mockResolvedValue({ user: USER });
        render(<App />);
        await waitFor(() => expect(editor()).toBeInTheDocument());
        expect(authScreen()).not.toBeInTheDocument();
    });

    test('a reset link opens the reset form when signed out', async () => {
        setUrl(`/reset-password?token=${TOKEN}`);
        render(<App />);
        await waitFor(() => expect(screen.getByLabelText(/new password/i)).toBeInTheDocument());
        expect(editor()).not.toBeInTheDocument();
    });

    test('a reset link beats an existing session (still the reset form, not the editor)', async () => {
        // Someone signed in on this device clicks the link from their email. They must
        // land on the reset form; dropping them into the editor would strand the link.
        api.me.mockResolvedValue({ user: USER });
        setUrl(`/reset-password?token=${TOKEN}`);
        render(<App />);
        await waitFor(() => expect(screen.getByLabelText(/new password/i)).toBeInTheDocument());
        expect(editor()).not.toBeInTheDocument();
    });

    // THE REGRESSION. Arriving on a reset link must not pin the user to the auth
    // screen forever: once they authenticate, the editor has to appear.
    test('after arriving on a reset link, logging in still reaches the editor', async () => {
        const user = userEvent.setup();
        setUrl(`/reset-password?token=${TOKEN}`);
        render(<App />);
        await waitFor(() => expect(screen.getByLabelText(/new password/i)).toBeInTheDocument());

        // Back to the login form and sign in normally.
        await user.click(screen.getByRole('button', { name: /back to log in/i }));
        api.login.mockResolvedValue({ user: USER });
        api.me.mockResolvedValue({ user: USER });
        await user.type(screen.getByLabelText(/email/i), USER.email);
        await user.type(screen.getByLabelText(/^password$/i), 'supersecret123');
        await user.click(screen.getByRole('button', { name: /^continue$/i }));

        // With the bug, this timed out: login succeeded but the auth screen stayed put.
        await waitFor(() => expect(editor()).toBeInTheDocument());
        expect(authScreen()).not.toBeInTheDocument();
    });

    test('after arriving on a reset link, browsing as guest still reaches the editor', async () => {
        const user = userEvent.setup();
        setUrl(`/reset-password?token=${TOKEN}`);
        render(<App />);
        await waitFor(() => expect(screen.getByLabelText(/new password/i)).toBeInTheDocument());

        await user.click(screen.getByRole('button', { name: /back to log in/i }));
        await user.click(screen.getByRole('button', { name: /browse as guest/i }));

        await waitFor(() => expect(editor()).toBeInTheDocument());
    });
});
