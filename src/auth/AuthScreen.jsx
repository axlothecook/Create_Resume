import { useState } from 'react';
import { api } from '../api/client';
import authBg from '../assets/auth-bg.jpg'; // LED-dot texture; fills the screen via cover
import { evaluatePassword, isPasswordValid } from './passwordRules';
import './authScreen.css';

// Shown when logged out. Defaults to login (email + password + Continue); a "Sign up"
// switch below Continue reveals the signup fields. Plus "Browse as guest".
// On success it calls onAuthenticated(user) / onGuest() so App can drop into the editor.
export default function AuthScreen({ onAuthenticated, onGuest, themeProp }) {
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
                ? await api.login(email, password)
                : await api.signup(email, username, password);
            onAuthenticated(res.user);
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div
            className={`auth-screen ${themeProp ? 'theme-dark' : 'theme-light'}`}
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

                    <div className={`auth-field ${mode === 'signup' ? passwordState : ''}`}>
                        <input id="auth-password" type="password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === 'signup' ? 8 : undefined} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} aria-invalid={mode === 'signup' && passwordState === 'is-invalid'} />
                        <label htmlFor="auth-password">Password</label>
                    </div>

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
