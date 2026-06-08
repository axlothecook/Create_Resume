import { useState, useEffect } from 'react';
import './toasts.css';

const DURATION = 4000; // visible time before auto-dismiss
const EXIT_MS = 280;   // slide/fade-out duration (keep in sync with toasts.css)

// A single toast: slides in from the right, shows a bottom progress bar that ticks
// right->left over DURATION, then retracts (slides back out + fades) before it's
// removed. Clicking it dismisses early (with the same exit animation).
const ToastItem = ({ toast, onRemove }) => {
    const [exiting, setExiting] = useState(false);

    // Start the auto-dismiss timer on mount.
    useEffect(() => {
        const t = setTimeout(() => setExiting(true), DURATION);
        return () => clearTimeout(t);
    }, []);

    // Once exiting, wait for the exit animation, then remove from the list.
    useEffect(() => {
        if (!exiting) return undefined;
        const t = setTimeout(() => onRemove(toast.id), EXIT_MS);
        return () => clearTimeout(t);
    }, [exiting, toast.id, onRemove]);

    return (
        <button
            type="button"
            className={`toast toast-${toast.type} ${exiting ? 'is-exiting' : ''}`}
            onClick={() => setExiting(true)}
            title="Dismiss"
        >
            <span className="toast-icon" aria-hidden="true">
                {toast.type === 'success' ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="13" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                )}
            </span>
            <span className="toast-message">{toast.message}</span>
            {/* Countdown bar: full width, ticks right->left over DURATION. Frozen on exit. */}
            <span
                className="toast-progress"
                aria-hidden="true"
                style={{ animationDuration: `${DURATION}ms`, animationPlayState: exiting ? 'paused' : 'running' }}
            />
        </button>
    );
};

// Top-right stack. `toasts` = [{ id, type:'success'|'error', message }].
const Toasts = ({ toasts, onDismiss }) => {
    if (!toasts.length) return null;
    return (
        <div className="toast-stack" role="status" aria-live="polite">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onRemove={onDismiss} />
            ))}
        </div>
    );
};

export default Toasts;
