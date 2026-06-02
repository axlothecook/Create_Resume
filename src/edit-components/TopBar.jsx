import './resumeEditor.css';
import DownloadSvg from '../components/Download';
import LogOutIcon from '../components/LogOut';
import Logo from '../components/Logo';
import ThemeSlider from '../components/ThemeSlider';

const TopBarDiv = (props) => {
    // Navbar uses the section-div colour for its background and the purple for its
    // foreground; dark mode swaps the two.
    //  - light: bg = #fff (div colour),  fg = #5e59a8 (darker purple)
    //  - dark : bg = #827eaf (purple),   fg = #504d75 (dark div colour)
    const navBg = !props.themeProp ? '#fff' : '#827eafff';
    const navFg = !props.themeProp ? '#5e59a8ff' : '#504d75ff';

    return (
        <div className="top-bar" style={{ backgroundColor: navBg }}>
            {/* Left: brand */}
            <Logo color={navFg} />

            {/* Right: actions */}
            <div className="top-bar-actions">
                <ThemeSlider themeProp={props.themeProp} setThemeProp={props.setThemeProp} />

                <LogOutIcon color={navFg} />

                <button className="download-pdf-btn" onClick={() => props.onClick()}>
                    <DownloadSvg color={navFg} />
                    <h3 style={{ fontWeight: 'bold', color: navFg }}>PDF</h3>
                </button>
            </div>
        </div>
    )
}

export default TopBarDiv;
