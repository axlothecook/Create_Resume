import './toasts.css';

// Top-right stack of toasts. `toasts` = [{ id, type:'success'|'error', message }].
// Each auto-dismisses after 5s (handled by the caller's timer) and can be clicked to
// dismiss early via onDismiss(id). Colour-coded with an icon, not colour alone.
const Toasts = ({ toasts, onDismiss }) => {
    if (!toasts.length) return null;
    return (
        <div className="toast-stack" role="status" aria-live="polite">
            {toasts.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    className={`toast toast-${t.type}`}
                    onClick={() => onDismiss(t.id)}
                    title="Dismiss"
                >
                    <span className="toast-icon" aria-hidden="true">
                        {t.type === 'success' ? (
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
                    <span className="toast-message">{t.message}</span>
                </button>
            ))}
        </div>
    );
};

export default Toasts;
