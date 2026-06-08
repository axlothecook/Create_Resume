import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './nameModal.css';

const FADE_MS = 600; // keep in sync with nameModal.css

// Centered confirm modal (Proceed / Cancel) over a dimmed backdrop, fading in/out like
// the name modal. Controlled by App: `open` shows it; onProceed / onCancel close it.
const ConfirmModal = ({ open, title, message, proceedLabel = 'Proceed', cancelLabel = 'Cancel', themeProp, onProceed, onCancel }) => {
    const [render, setRender] = useState(open);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (open) { setRender(true); setClosing(false); }
        else if (render) {
            setClosing(true);
            const t = setTimeout(() => { setRender(false); setClosing(false); }, FADE_MS);
            return () => clearTimeout(t);
        }
        return undefined;
    }, [open, render]);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onCancel]);

    if (!render) return null;

    // Portal to <body> so the modal sits in the root stacking context, above the
    // editor's transform/animation stacking contexts (prevents the section arrow / eye
    // SVGs punching through the backdrop during the fade-in).
    return createPortal(
        <div
            className={`name-modal-backdrop ${closing ? 'is-closing' : ''} ${themeProp ? 'theme-dark' : 'theme-light'}`}
            onMouseDown={onCancel}
        >
            <div className="name-modal" onMouseDown={(e) => e.stopPropagation()}>
                <h2 className="name-modal-title">{title}</h2>
                <p className="confirm-modal-message">{message}</p>
                <div className="name-modal-actions">
                    <button type="button" className="name-modal-btn name-modal-cancel" onClick={onCancel}>{cancelLabel}</button>
                    <button type="button" className="name-modal-btn name-modal-save" onClick={onProceed}>{proceedLabel}</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmModal;
