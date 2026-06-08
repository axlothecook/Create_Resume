import { useState } from 'react';
import { api } from '../api/client';
import authBg from '../assets/auth-bg.jpg'; // LED-dot texture; fills the screen via cover
import { evaluatePassword, isPasswordValid } from './passwordRules';
import TabOpenSvg from '../components/TabOpen';
import TabClosedSvg from '../components/TabClosedSvg';
import './authScreen.css';

// Shown when logged out. Defaults to login (email + password + Continue); a "Sign up"
// switch below Continue reveals the signup fields. Plus "Browse as guest".
// On success it calls onAuthenticated(user) / onGuest() so App can drop into the editor.
export default function AuthScreen({ onAuthenticated, onGuest }) {
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // eye toggle (both modes)
    const [rememberMe, setRememberMe] = useState(false);     // login only
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    // Live password validation (signup only). The checklist + border read from these.
    const passwordChecks = evaluatePassword(password);
    const passwordOk = isPasswordValid(password);
    // Border colour: only flag once the user has typed something.
    const passwordState = password.length === 0 ? '' : (passwordOk ? 'is-valid' : 'is-invalid');

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        // The submit button stays ENABLED (per UX best practice); on an invalid signup
        // password we reveal the inline errors instead of sending a doomed request.
        if (mode === 'signup' && !passwordOk) {
            setError('Please meet all the password requirements below.');
            return;
        }
        setBusy(true);
        try {
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

                <form className="auth-form" onSubmit={submit}>
                    {/* Floating-label fields: the input carries a single-space placeholder
                        (so :placeholder-shown works); the <span> label sits as the
                        placeholder, then floats onto the border + highlights on focus or
                        when filled. Order = input THEN label (CSS sibling selectors). */}
                    <div className="auth-field">
                        <input id="auth-email" type="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                        <label htmlFor="auth-email">Email</label>
                    </div>

                    {mode === 'signup' && (
                        <div className="auth-field">
                            <input id="auth-username" type="text" placeholder=" " value={username} onChange={(e) => setUsername(e.target.value)} required minLength={2} maxLength={40} autoComplete="username" />
                            <label htmlFor="auth-username">Username</label>
                        </div>
                    )}

                    <div className={`auth-field auth-field-password ${mode === 'signup' ? passwordState : ''}`}>
                        <input id="auth-password" type={showPassword ? 'text' : 'password'} placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === 'signup' ? 8 : undefined} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} aria-invalid={mode === 'signup' && passwordState === 'is-invalid'} />
                        <label htmlFor="auth-password">Password</label>
                        {/* Show/hide password eye (both login + signup). */}
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
                    {mode === 'signup' && (
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

                    <button type="submit" className="auth-submit" disabled={busy}>
                        {busy ? 'Please wait…' : (mode === 'login' ? 'Continue' : 'Create account')}
                    </button>

                    {/* Mode switch sits BELOW Continue (no top tabs). */}
                    {mode === 'login' ? (
                        <p className="auth-switch">
                            New here?{' '}
                            <button type="button" className="auth-switch-btn" onClick={() => { setMode('signup'); setError(''); }}>Sign up</button>
                        </p>
                    ) : (
                        <p className="auth-switch">
                            Already have an account?{' '}
                            <button type="button" className="auth-switch-btn" onClick={() => { setMode('login'); setError(''); }}>Log in</button>
                        </p>
                    )}
                </form>

                <div className="auth-divider"><span>or</span></div>

                <button type="button" className="auth-guest" onClick={onGuest}>
                    Browse as guest
                </button>
                <p className="auth-guest-note">Guests can build and download résumés but can’t save them.</p>
            </div>
        </div>
    );
}
