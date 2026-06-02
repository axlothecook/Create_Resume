import { useState } from 'react';
import { api } from '../api/client';
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

    const submit = async (e) => {
        e.preventDefault();
        setError('');
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
        <div className={`auth-screen ${themeProp ? 'theme-dark' : 'theme-light'}`}>
            <div className="auth-card">
                <h1 className="auth-title">Resume Creator</h1>

                <form className="auth-form" onSubmit={submit}>
                    <label className="auth-label">
                        Email
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                    </label>

                    {mode === 'signup' && (
                        <label className="auth-label">
                            Username
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={2} maxLength={40} autoComplete="username" />
                        </label>
                    )}

                    <label className="auth-label">
                        Password
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={mode === 'signup' ? 8 : undefined} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
                        {mode === 'signup' && <span className="auth-hint">At least 8 characters.</span>}
                    </label>

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
