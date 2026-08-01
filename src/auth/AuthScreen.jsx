import { useState, useEffect } from 'react';
import { api } from '../api/client';
import authBg from '../assets/auth-bg.jpg'; // LED-dot texture; fills the screen via cover
import { evaluatePassword, isPasswordValid } from './passwordRules';
import TabOpenSvg from '../components/TabOpen';
import TabClosedSvg from '../components/TabClosedSvg';
import './authScreen.css';

// The reset link mailed by the backend looks like /reset-password?token=<64 hex>.
// There is no router in this app, and nginx already serves index.html for unknown
// paths, so the token is read straight off the URL instead of adding one.
export function readResetToken() {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('token') || '';
}

const SUBMIT_LABEL = {
    login: 'Continue',
    signup: 'Create account',
    forgot: 'Send reset link',
    reset: 'Change password',
};

// How long the forgot-password button stays locked after a request, in seconds. The
// countdown IS the confirmation: it only starts once the request came back, so a
// button that changed means the request went through. It also keeps someone from
// burning their per-email allowance (3/hour) on impatient double-clicks.
const RESEND_COOLDOWN_SECONDS = 60;

// Shown when logged out. Defaults to login (email + password + Continue); a "Sign up"
// switch below Continue reveals the signup fields. Plus "Browse as guest".
// On success it calls onAuthenticated(user) / onGuest() so App can drop into the editor.
// Also carries the two password-recovery modes: 'forgot' (ask for a reset link) and
// 'reset' (choose a new password), the latter entered by arriving with a token in the URL.
export default function AuthScreen({ onAuthenticated, onGuest }) {
    const [resetToken, setResetToken] = useState(readResetToken);
    // Landing with a token means the user clicked a reset link: go straight there.
    const [mode, setMode] = useState(() => (readResetToken() ? 'reset' : 'login'));
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // eye toggle (both modes)
    const [rememberMe, setRememberMe] = useState(false);     // login only
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');                // neutral, non-error feedback
    const [busy, setBusy] = useState(false);
    // Seconds left before another reset link can be requested; 0 = free to send.
    const [cooldown, setCooldown] = useState(0);
    // Whether a link has been requested at all this visit, so the button can read
    // "Send link again" rather than reverting to "Send reset link" once it unlocks.
    const [linkSent, setLinkSent] = useState(false);

    // Tick the cooldown down once a second. One timeout per second rather than a
    // single interval, so the cleanup covers unmount and mode switches alike.
    useEffect(() => {
        if (cooldown <= 0) return undefined;
        const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(id);
    }, [cooldown]);

    // Which fields each mode needs. Keeps the JSX conditions readable.
    const needsEmail = mode === 'login' || mode === 'signup' || mode === 'forgot';
    const needsPassword = mode === 'login' || mode === 'signup' || mode === 'reset';
    // A new password is being CHOSEN (not just typed), so show the live checklist.
    const choosingPassword = mode === 'signup' || mode === 'reset';

    // Live password validation. The checklist + border read from these.
    const passwordChecks = evaluatePassword(password);
    const passwordOk = isPasswordValid(password);
    // Border colour: only flag once the user has typed something.
    const passwordState = password.length === 0 ? '' : (passwordOk ? 'is-valid' : 'is-invalid');

    const switchMode = (next) => {
        setMode(next);
        setError('');
        setNotice('');
        setPassword('');
        setCooldown(0);
        setLinkSent(false);
    };

    // The forgot button doubles as the confirmation, so its label carries the state:
    // locked with a countdown right after a request, then unlocked as "again".
    const submitLabel = (() => {
        if (busy) return 'Please wait…';
        if (mode === 'forgot' && cooldown > 0) {
            return `Send link again (${String(cooldown).padStart(2, '0')})`;
        }
        if (mode === 'forgot' && linkSent) return 'Send link again';
        return SUBMIT_LABEL[mode];
    })();

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setNotice('');
        // The submit button stays ENABLED (per UX best practice); on an invalid new
        // password we reveal the inline errors instead of sending a doomed request.
        if (choosingPassword && !passwordOk) {
            setError('Please meet all the password requirements below.');
            return;
        }
        setBusy(true);
        try {
            if (mode === 'forgot') {
                await api.forgotPassword(email);
                // The button itself becomes the feedback: it locks and counts down.
                // Note what is NOT here — nothing about whether the address is
                // registered. The backend answers identically either way, and the
                // countdown starts identically too, so the UI leaks nothing.
                setLinkSent(true);
                setCooldown(RESEND_COOLDOWN_SECONDS);
                return;
            }

            if (mode === 'reset') {
                await api.resetPassword(resetToken, password);
                // Drop the token out of the address bar and browser history now that
                // it is spent, so it can't be re-shared or shoulder-surfed.
                if (typeof window !== 'undefined') {
                    window.history.replaceState({}, '', window.location.pathname);
                }
                setResetToken('');
                setMode('login');
                setPassword('');
                // No auto-login by design (the backend does not create a session here).
                setNotice('Your password has been changed. You can log in with it now.');
                return;
            }

            const res = mode === 'login'
                ? await api.login(email, password, rememberMe)
                : await api.signup(email, username, password);
            // Confirm the session cookie actually STUCK: re-ask the server who we are.
            // If login succeeded but /auth/me comes back empty, the browser is dropping
            // the cookie (privacy/tracking protection, or the site was opened over plain
            // http where a Secure cookie can't be stored). Tell the user plainly instead
            // of dropping them into the editor where every save would silently fail.
            const check = await api.me();
            if (!check.user) {
                setError(
                    "You're signed in, but your browser is blocking cookies for this site, so it won't stay logged in (saving won't work). Make sure you're on the https:// site, allow cookies / disable privacy protection for it, and avoid private/incognito mode — then try again."
                );
                return;
            }
            onAuthenticated(res.user);
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setBusy(false);
        }
    };

    return (
        // The auth screen is ALWAYS light — it never follows the app's dark/light theme.
        <div
            className="auth-screen theme-light"
            style={{ '--auth-bg': `url(${authBg})` }}
        >
            {/* Dim overlay so the card reads clearly on top of the photo. */}
            <div className="auth-overlay" aria-hidden="true" />
            <div className="auth-card">
                <h1 className="auth-title">Resume Creator</h1>

                {mode === 'forgot' && (
                    <p className="auth-lead">Enter your email and we&rsquo;ll send you a link to choose a new password.</p>
                )}
                {mode === 'reset' && (
                    <p className="auth-lead">Choose a new password for your account.</p>
                )}

                <form className="auth-form" onSubmit={submit}>
                    {/* Floating-label fields: the input carries a single-space placeholder
                        (so :placeholder-shown works); the <span> label sits as the
                        placeholder, then floats onto the border + highlights on focus or
                        when filled. Order = input THEN label (CSS sibling selectors). */}
                    {needsEmail && (
                        <div className="auth-field">
                            <input id="auth-email" type="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                            <label htmlFor="auth-email">Email</label>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <div className="auth-field">
                            <input id="auth-username" type="text" placeholder=" " value={username} onChange={(e) => setUsername(e.target.value)} required minLength={2} maxLength={40} autoComplete="username" />
                            <label htmlFor="auth-username">Username</label>
                        </div>
                    )}

                    {needsPassword && (
                        <div className={`auth-field auth-field-password ${choosingPassword ? passwordState : ''}`}>
                            <input id="auth-password" type={showPassword ? 'text' : 'password'} placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required minLength={choosingPassword ? 8 : undefined} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} aria-invalid={choosingPassword && passwordState === 'is-invalid'} />
                            <label htmlFor="auth-password">{mode === 'reset' ? 'New password' : 'Password'}</label>
                            {/* Show/hide password eye (every mode with a password field). */}
                            <button
                                type="button"
                                className="auth-pw-toggle"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-pressed={showPassword}
                                tabIndex={-1}
                            >
                                {showPassword ? <TabClosedSvg /> : <TabOpenSvg />}
                            </button>
                        </div>
                    )}

                    {/* Forgot-password link sits directly under the password field. */}
                    {mode === 'login' && (
                        <p className="auth-forgot">
                            <button type="button" className="auth-switch-btn" onClick={() => switchMode('forgot')}>
                                Forgot your password?
                            </button>
                        </p>
                    )}

                    {/* "Remember me" — login only. Checked = 30-day session; unchecked =
                        a browser-session cookie that ends when the browser closes. */}
                    {mode === 'login' && (
                        <label className="auth-remember">
                            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                            <span>Remember me</span>
                        </label>
                    )}

                    {/* Live requirements checklist — signup only. Each rule ticks green
                        as it's met (icon + text, not colour alone, for accessibility). */}
                    {choosingPassword && (
                        <ul className="auth-pw-checklist" aria-label="Password requirements">
                            {passwordChecks.map((c) => (
                                <li key={c.key} className={c.passed ? 'is-passed' : ''}>
                                    <span className="auth-pw-mark" aria-hidden="true">{c.passed ? '✓' : '○'}</span>
                                    {c.label}
                                </li>
                            ))}
                        </ul>
                    )}

                    {error && <p className="auth-error">{error}</p>}
                    {notice && <p className="auth-notice" role="status">{notice}</p>}

                    <button type="submit" className="auth-submit" disabled={busy || cooldown > 0}>
                        {submitLabel}
                    </button>

                    {/* Mode switch sits BELOW Continue (no top tabs). */}
                    {mode === 'login' && (
                        <p className="auth-switch">
                            New here?{' '}
                            <button type="button" className="auth-switch-btn" onClick={() => switchMode('signup')}>Sign up</button>
                        </p>
                    )}
                    {mode === 'signup' && (
                        <p className="auth-switch">
                            Already have an account?{' '}
                            <button type="button" className="auth-switch-btn" onClick={() => switchMode('login')}>Log in</button>
                        </p>
                    )}
                    {(mode === 'forgot' || mode === 'reset') && (
                        <p className="auth-switch">
                            <button type="button" className="auth-switch-btn" onClick={() => switchMode('login')}>Back to log in</button>
                        </p>
                    )}
                </form>

                {/* Guest browsing is an alternative to signing IN — it makes no sense
                    while recovering a password, so it stays out of those two modes. */}
                {(mode === 'login' || mode === 'signup') && (
                    <>
                        <div className="auth-divider"><span>or</span></div>

                        <button type="button" className="auth-guest" onClick={onGuest}>
                            Browse as guest
                        </button>
                        <p className="auth-guest-note">Guests can build and download résumés but can’t save them.</p>
                    </>
                )}
            </div>
        </div>
    );
}
