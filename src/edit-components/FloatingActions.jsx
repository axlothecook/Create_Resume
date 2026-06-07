import './floatingActions.css';
import DownloadSvg from '../components/Download';

// Fixed floating action buttons at the bottom-right of the screen (stay put on
// scroll). Order left→right: Save, then Download. Each is a white rounded square,
// icon only. Save shows for logged-in users only; Download is for everyone.
const FloatingActions = ({ isGuest, busy, onSave, onDownloadPdf }) => {
    return (
        <div className="floating-actions">
            {!isGuest && (
                <button
                    type="button"
                    className="floating-action-btn"
                    onClick={onSave}
                    disabled={busy}
                    title="Save the current résumé"
                    aria-label="Save the current résumé"
                >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 20V15H9V20M18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H14.1716C14.702 4 15.2107 4.21071 15.5858 4.58579L19.4142 8.41421C19.7893 8.78929 20 9.29799 20 9.82843V18C20 19.1046 19.1046 20 18 20Z" />
                    </svg>
                </button>
            )}

            <button
                type="button"
                className="floating-action-btn"
                onClick={onDownloadPdf}
                title="Download PDF"
                aria-label="Download PDF"
            >
                <DownloadSvg color="currentColor" />
            </button>
        </div>
    );
};

export default FloatingActions;
