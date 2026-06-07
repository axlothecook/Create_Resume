import { useState } from 'react';
import './savedDocsRail.css';
import ThemeSlider from '../components/ThemeSlider';
import LogOutIcon from '../components/LogOut';
import DownloadSvg from '../components/Download';

// Left-side collapsible rail — the app's ONLY chrome (the topbar was removed).
// Shown for everyone: guests get PDF + theme + sign-in, but NOT the saved-docs
// actions (Add new / Save / the saved list) — those are logged-in only.
//
//  brand row → toggle (burger<->X) sits at the FAR RIGHT, opposite the logo + name
//  actions   → "+ Add new", "Save" (logged-in), "PDF" download (everyone)
//  list      → one row per saved résumé (logged-in)
//  footer    → log out / sign in + theme toggle
//
// Collapsed → icons only, led by the hamburger toggle (no logo / user image).
const SavedDocsRail = (props) => {
    const {
        isGuest,
        docs, currentDocId, maxReached, busy,
        onAddNew, onSave, onLoad, onDelete, onDownloadPdf,
        themeProp, setThemeProp, onLogout,
    } = props;

    const [open, setOpen] = useState(true);

    // The morphing burger<->X toggle (used at the top of the rail in both states).
    const toggle = (
        <button
            type="button"
            className={`docs-rail-toggle ${open ? 'is-x' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Collapse menu' : 'Expand menu'}
            aria-expanded={open}
            title={open ? 'Collapse' : 'Expand'}
        >
            <span className="docs-rail-burger" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </span>
        </button>
    );

    return (
        <aside className={`docs-rail ${open ? 'is-open' : 'is-collapsed'} ${themeProp ? 'theme-dark' : 'theme-light'}`}>
            {/* Brand row: name on the left, toggle on the FAR RIGHT (no logo box).
                Collapsed → only the toggle shows (name hidden). */}
            <div className="docs-rail-brand">
                <div className="docs-rail-brand-id">
                    <span className="docs-rail-brand-text"><strong>Resume Creator</strong></span>
                </div>
                {toggle}
            </div>

            {/* Primary actions */}
            <div className="docs-rail-actions">
                {!isGuest && (
                    <>
                        <button
                            type="button"
                            className="docs-rail-item docs-rail-add"
                            onClick={onAddNew}
                            disabled={busy}
                            title={maxReached ? 'Maximum of 10 saved résumés reached' : 'Start a new résumé'}
                        >
                            <span className="docs-rail-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            </span>
                            <span className="docs-rail-label">Add new</span>
                        </button>

                        <button
                            type="button"
                            className="docs-rail-item docs-rail-save"
                            onClick={onSave}
                            disabled={busy}
                            title="Save the current résumé"
                        >
                            <span className="docs-rail-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                            </span>
                            <span className="docs-rail-label">Save</span>
                        </button>
                    </>
                )}

                {/* PDF download — available to everyone (replaces the removed topbar button). */}
                <button
                    type="button"
                    className="docs-rail-item docs-rail-pdf"
                    onClick={onDownloadPdf}
                    title="Download PDF"
                >
                    <span className="docs-rail-icon" aria-hidden="true">
                        <DownloadSvg color="currentColor" />
                    </span>
                    <span className="docs-rail-label">Download PDF</span>
                </button>
            </div>

            {/* Saved-résumé list (logged-in only). */}
            {!isGuest && (
                <div className="docs-rail-list">
                    {docs.length === 0 && (
                        <p className="docs-rail-empty">No saved résumés yet.</p>
                    )}
                    {docs.map((doc) => {
                        const active = doc.id === currentDocId;
                        return (
                            <div key={doc.id} className={`docs-rail-row ${active ? 'is-active' : ''}`}>
                                <button
                                    type="button"
                                    className="docs-rail-item docs-rail-doc"
                                    onClick={() => onLoad(doc.id)}
                                    disabled={busy}
                                    title={doc.title}
                                >
                                    <span className="docs-rail-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    </span>
                                    <span className="docs-rail-label docs-rail-doc-title">{doc.title}</span>
                                </button>
                                <button
                                    type="button"
                                    className="docs-rail-delete"
                                    onClick={() => onDelete(doc.id, doc.title)}
                                    disabled={busy}
                                    aria-label={`Delete ${doc.title}`}
                                    title="Delete"
                                >
                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                    {maxReached && <p className="docs-rail-max">Limit of 10 reached.</p>}
                </div>
            )}

            {/* Footer: theme toggle, then a full-width coloured Log Out bar pinned at the
                very bottom — "Log Out" text on the LEFT, icon on the RIGHT (per the
                reference). Collapsed → icon only. margin-top:auto pushes it down. */}
            <div className="docs-rail-footer">
                <div className="docs-rail-theme">
                    <ThemeSlider themeProp={themeProp} setThemeProp={setThemeProp} />
                </div>

                <button type="button" className="docs-rail-logout-bar" onClick={onLogout} title={isGuest ? 'Sign in' : 'Log out'}>
                    <span className="docs-rail-label">{isGuest ? 'Sign in' : 'Log out'}</span>
                    <span className="docs-rail-icon" aria-hidden="true">
                        <LogOutIcon color="currentColor" />
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default SavedDocsRail;
