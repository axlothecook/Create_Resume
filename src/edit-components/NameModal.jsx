import { useState, useEffect, useRef } from 'react';
import './nameModal.css';

// Centered modal for naming a résumé (replaces window.prompt). Controlled by App:
// `open` shows it; onSubmit(title) is called with the trimmed name; onCancel closes.
// Enter submits, Esc / backdrop click cancels, the input autofocuses.
const FADE_MS = 600; // keep in sync with the CSS animation duration

const NameModal = ({ open, initialValue = '', themeProp, onSubmit, onCancel }) => {
    const [value, setValue] = useState(initialValue);
    // Stay mounted through the fade-OUT: `render` keeps it in the DOM, `closing`
    // triggers the exit animation before unmounting.
    const [render, setRender] = useState(open);
    const [closing, setClosing] = useState(false);
    const inputRef = useRef(null);

    // Drive mount/unmount + the closing animation from `open`.
    useEffect(() => {
        if (open) {
            setRender(true);
            setClosing(false);
        } else if (render) {
            setClosing(true);
            const t = setTimeout(() => { setRender(false); setClosing(false); }, FADE_MS);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [open, render]);

    // Reset + focus when opened.
    useEffect(() => {
        if (open) {
            setValue(initialValue);
            const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [open, initialValue]);

    // Esc to cancel.
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onCancel]);

    if (!render) return null;

    const submit = (e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return; // require a name
        onSubmit(trimmed);
    };

    return (
        <div
            className={`name-modal-backdrop ${closing ? 'is-closing' : ''} ${themeProp ? 'theme-dark' : 'theme-light'}`}
            onMouseDown={onCancel}
        >
            {/* stop propagation so clicks inside the card don't close it */}
            <div className="name-modal" onMouseDown={(e) => e.stopPropagation()}>
                <h2 className="name-modal-title">Name your résumé</h2>
                <form onSubmit={submit}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="name-modal-input"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g. Frontend Developer CV"
                        maxLength={120}
                    />
                    <div className="name-modal-actions">
                        <button type="button" className="name-modal-btn name-modal-cancel" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="name-modal-btn name-modal-save" disabled={!value.trim()}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NameModal;
