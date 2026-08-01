import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

// Mock the API so these tests cover the SCREEN's behaviour, not the network.
vi.mock('../api/client', () => ({
    api: {
        login: vi.fn(),
        signup: vi.fn(),
        me: vi.fn(),
        forgotPassword: vi.fn(),
        resetPassword: vi.fn(),
    },
}));

import { api } from '../api/client';
import AuthScreen from './AuthScreen';

// AuthScreen reads the token from the URL at mount, so each test sets the URL first.
function setUrl(search) {
    window.history.replaceState({}, '', `/reset-password${search}`);
}

beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/');
});
afterEach(() => {
    window.history.replaceState({}, '', '/');
});

const TOKEN = 'a'.repeat(64);

describe('forgot-password flow', () => {
    test('the login screen offers a forgot-password link', () => {
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);
        expect(screen.getByRole('button', { name: /forgot your password/i })).toBeInTheDocument();
    });

    test('the link opens a form that asks only for an email', async () => {
        const user = userEvent.setup();
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);
        await user.click(screen.getByRole('button', { name: /forgot your password/i }));

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.queryByLabelText(/^password$/i)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    });

    test('submitting calls the API and locks the button into a countdown', async () => {
        const user = userEvent.setup();
        api.forgotPassword.mockResolvedValue({ ok: true });
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: /forgot your password/i }));
        await user.type(screen.getByLabelText(/email/i), 'someone@example.com');
        await user.click(screen.getByRole('button', { name: /send reset link/i }));

        expect(api.forgotPassword).toHaveBeenCalledWith('someone@example.com');
        // The button IS the confirmation now: it locks and starts counting down.
        const button = await screen.findByRole('button', { name: /send link again \(60\)/i });
        expect(button).toBeDisabled();
    });

    test('says nothing about whether the account exists', async () => {
        const user = userEvent.setup();
        api.forgotPassword.mockResolvedValue({ ok: true });
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: /forgot your password/i }));
        await user.type(screen.getByLabelText(/email/i), 'someone@example.com');
        await user.click(screen.getByRole('button', { name: /send reset link/i }));
        await screen.findByRole('button', { name: /send link again/i });

        // Nothing anywhere confirms or denies the address. The backend responds
        // identically for both cases; the UI must too.
        expect(document.body.textContent).not.toMatch(/not registered|no account|we sent|doesn't exist|does not exist/i);
    });

    test('announces the result to screen readers without showing it on screen', async () => {
        const user = userEvent.setup();
        api.forgotPassword.mockResolvedValue({ ok: true });
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: /forgot your password/i }));
        // Nothing to announce before a request is made.
        expect(screen.queryByRole('status')).not.toBeInTheDocument();

        await user.type(screen.getByLabelText(/email/i), 'someone@example.com');
        await user.click(screen.getByRole('button', { name: /send reset link/i }));

        // The countdown button is the SIGHTED confirmation; this live region is the
        // equivalent for anyone who can't see it change.
        const status = await screen.findByRole('status');
        expect(status).toHaveClass('auth-sr-only');
        // Same conditional phrasing as everything else: no enumeration through audio.
        expect(status).toHaveTextContent(/if an account exists/i);
        expect(status).toHaveTextContent(/15 minutes/i);
    });

    // NOTE: the countdown TICKING (60 → 59 → … → unlocked) is deliberately not unit
    // tested. Driving it needs vi.useFakeTimers(), which hangs userEvent and leaked
    // into every following test in this file. The locked state and the label are
    // covered above; the tick itself is verified in a real browser.

    test('can go back to log in', async () => {
        const user = userEvent.setup();
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);
        await user.click(screen.getByRole('button', { name: /forgot your password/i }));
        await user.click(screen.getByRole('button', { name: /back to log in/i }));
        expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument();
    });
});

describe('reset-password flow', () => {
    test('arriving with a token in the URL opens the reset form directly', () => {
        setUrl(`?token=${TOKEN}`);
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);

        expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
        // Not a login screen: no email field, no guest button.
        expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /browse as guest/i })).not.toBeInTheDocument();
    });

    test('without a token it stays on the login screen', () => {
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);
        expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /change password/i })).not.toBeInTheDocument();
    });

    test('shows the live password checklist while choosing a new password', async () => {
        const user = userEvent.setup();
        setUrl(`?token=${TOKEN}`);
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);

        expect(screen.getByLabelText(/password requirements/i)).toBeInTheDocument();
        await user.type(screen.getByLabelText(/new password/i), 'goodpassword1');
        const met = screen.getByLabelText(/password requirements/i).querySelectorAll('li.is-passed');
        expect(met.length).toBe(4);
    });

    test('a password failing the rules is not sent to the server', async () => {
        const user = userEvent.setup();
        setUrl(`?token=${TOKEN}`);
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);

        await user.type(screen.getByLabelText(/new password/i), 'short');
        await user.click(screen.getByRole('button', { name: /change password/i }));

        expect(api.resetPassword).not.toHaveBeenCalled();
        expect(screen.getByText(/meet all the password requirements/i)).toBeInTheDocument();
    });

    test('a successful reset sends the token, does NOT log in, and strips the token from the URL', async () => {
        const user = userEvent.setup();
        api.resetPassword.mockResolvedValue({ ok: true });
        const onAuthenticated = vi.fn();
        setUrl(`?token=${TOKEN}`);
        render(<AuthScreen onAuthenticated={onAuthenticated} onGuest={vi.fn()} />);

        await user.type(screen.getByLabelText(/new password/i), 'brandnewpass123');
        await user.click(screen.getByRole('button', { name: /change password/i }));

        expect(api.resetPassword).toHaveBeenCalledWith(TOKEN, 'brandnewpass123');
        // No auto-login: the app must not be handed a user.
        expect(onAuthenticated).not.toHaveBeenCalled();
        // Back on the login form, with confirmation.
        expect(await screen.findByRole('status')).toHaveTextContent(/password has been changed/i);
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /^continue$/i })).toBeInTheDocument();
        });
        // The spent token must not linger in the address bar or history.
        expect(window.location.search).toBe('');
    });

    test('a rejected token surfaces the server message and keeps the form open', async () => {
        const user = userEvent.setup();
        api.resetPassword.mockRejectedValue(new Error('This password reset link is invalid or has expired.'));
        setUrl(`?token=${TOKEN}`);
        render(<AuthScreen onAuthenticated={vi.fn()} onGuest={vi.fn()} />);

        await user.type(screen.getByLabelText(/new password/i), 'brandnewpass123');
        await user.click(screen.getByRole('button', { name: /change password/i }));

        expect(await screen.findByText(/invalid or has expired/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });
});
