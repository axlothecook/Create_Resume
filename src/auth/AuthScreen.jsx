import { useState } from 'react';
import { api } from '../api/client';
import './authScreen.css';

// Shown when logged out. Tabs between Login and Sign up, plus "Browse as guest".
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

                <div className="auth-tabs">
                    <button
                        type="button"
                        className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
                        onClick={() => { setMode('login'); setError(''); }}
                    >Log in</button>
                    <button
                        type="button"
                        className={mode === 'signup' ? 'auth-tab active' : 'auth-tab'}
                        onClick={() => { setMode('signup'); setError(''); }}
                    >Sign up</button>
                </div>

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
