import './resumeEditor.css';
import DownloadSvg from '../components/Download';
import LogOutIcon from '../components/LogOut';
import Logo from '../components/Logo';
import ThemeSlider from '../components/ThemeSlider';

const TopBarDiv = (props) => {
    // Navbar bg/fg are SWAPPED vs before: the bar now carries the purple as its
    // background and the light div-colour as its foreground; dark mode mirrors it.
    //  - light: bg = #5e59a8 (darker purple), fg = #fff (div colour)
    //  - dark : bg = #504d75 (dark div col),  fg = #827eaf (purple)
    const navBg = !props.themeProp ? '#5e59a8ff' : '#504d75ff';
    const navFg = !props.themeProp ? '#fff' : '#827eafff';

    return (
        <div className="top-bar" style={{ backgroundColor: navBg }}>
            {/* Left: brand (logo + website name) — the only branding the bar carries. */}
            <Logo color={navFg} />

            {/* Right: actions. Logged-in users get only the PDF button here — their theme
                toggle + logout live on the saved-docs rail. Guests have no rail, so they
                keep the theme toggle + logout (= "Sign in") in the navbar. */}
            <div className="top-bar-actions">
                {props.isGuest && (
                    <>
                        <ThemeSlider themeProp={props.themeProp} setThemeProp={props.setThemeProp} />
                        <button
                            type="button"
                            className="navbar-logout-btn"
                            onClick={() => props.onLogout && props.onLogout()}
                            title="Sign in"
                            aria-label="Sign in"
                        >
                            <LogOutIcon color={navFg} />
                        </button>
                    </>
                )}

                <button className="download-pdf-btn" onClick={() => props.onClick()}>
                    <DownloadSvg color={navFg} />
                    <h3 style={{ fontWeight: 'bold', color: navFg }}>PDF</h3>
                </button>
            </div>
        </div>
    )
}

export default TopBarDiv;
