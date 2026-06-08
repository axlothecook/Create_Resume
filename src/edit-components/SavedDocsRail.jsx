import { useState } from 'react';
import './savedDocsRail.css';
import ThemeSlider from '../components/ThemeSlider';
import LogOutIcon from '../components/LogOut';
import ResumePreview from '../resume-component/ResumePreview';

// Left-side collapsible rail — the app's ONLY chrome (the topbar was removed).
// Shown for everyone; the saved-docs actions (Add new / the saved list) are
// logged-in only. Save + Download PDF live as fixed floating buttons (see App).
//
//  brand row → toggle (burger<->X) sits at the FAR RIGHT, opposite the name
//  actions   → "+ Add new" (logged-in)
//  list      → one row per saved résumé (logged-in)
//  footer    → log out / sign in + theme toggle
//
// Collapsed → icons only, led by the hamburger toggle (no logo / user image).
const SavedDocsRail = (props) => {
    const {
        isGuest, user,
        docs, currentDocId, busy,
        setSvgClr, setTxtClr,
        onAddNew, onLoad, onDelete,
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
            {/* Brand block: the "Resume Creator" row (title + toggle) and, for logged-in
                users, a "Hello {username}!" greeting — both sit above the divider line. */}
            <div className="docs-rail-brand">
                <div className="docs-rail-brand-row">
                    <div className="docs-rail-brand-id">
                        <span className="docs-rail-brand-text"><strong>Resume Creator</strong></span>
                    </div>
                    {toggle}
                </div>
                {!isGuest && user && (
                    <h3 className="docs-rail-greeting">Hello {user.username}!</h3>
                )}
            </div>

            {/* Saved-docs area (logged-in only): an A4-shaped dashed "Add new" card,
                then either an empty note or a scrollable column of saved-CV cards that
                each show a live, scaled-down preview of the whole résumé. */}
            {!isGuest && (
                <div className="docs-rail-saved">
                    <button
                        type="button"
                        className="docs-add-card"
                        onClick={onAddNew}
                        title="Start a new résumé"
                    >
                        <span className="docs-add-card-inner">
                            <span className="docs-add-card-label">Add New</span>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 12H12M12 12H18M12 12V18M12 12V6" />
                            </svg>
                        </span>
                    </button>

                    {docs.length === 0 ? (
                        <p className="docs-rail-empty">No saved résumés yet.</p>
                    ) : (
                        <div className="docs-cards">
                            {docs.map((doc) => {
                                const active = doc.id === currentDocId;
                                return (
                                    <div
                                        key={doc.id}
                                        className={`docs-card ${active ? 'is-active' : ''}`}
                                    >
                                        <button
                                            type="button"
                                            className="docs-card-load"
                                            onClick={() => onLoad(doc.id)}
                                            disabled={busy}
                                            title={doc.title}
                                            aria-label={`Load ${doc.title}`}
                                        >
                                            {/* Scaled-down live render of the whole résumé. */}
                                            <span className="docs-card-preview" aria-hidden="true">
                                                {doc.data
                                                    ? <span className="docs-card-scale">
                                                        <ResumePreview data={doc.data} setSvgClr={setSvgClr} setTxtClr={setTxtClr} />
                                                      </span>
                                                    : <span className="docs-card-noprev">Preview unavailable</span>}
                                            </span>
                                            {/* CV name overlaid in the middle, with a shadow scrim. */}
                                            <span className="docs-card-name">{doc.title}</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="docs-card-delete"
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
                        </div>
                    )}
                </div>
            )}

            {/* Footer: a theme-toggle PILL (moon/sun icon + label + switch), then a
                full-width Log Out bar (icon sits next to the text). Collapsed → icons
                only. margin-top:auto pushes the footer to the bottom. */}
            <div className="docs-rail-footer">
                <div className="docs-rail-theme">
                    <span className="docs-rail-theme-icon" aria-hidden="true">
                        {themeProp ? (
                            // Moon (dark mode active)
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
                            </svg>
                        ) : (
                            // Sun (light mode active)
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
                            </svg>
                        )}
                    </span>
                    <span className="docs-rail-theme-label">{themeProp ? 'Dark mode' : 'Light mode'}</span>
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
