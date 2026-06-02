import './resumeEditor.css';
import DownloadSvg from '../components/Download';
import LogOutIcon from '../components/LogOut';
import Logo from '../components/Logo';
import ThemeSlider from '../components/ThemeSlider';

const TopBarDiv = (props) => {
    return (
        <div className="top-bar" style={{backgroundColor: !props.themeProp ? '#827eafff' : '#5e59a8ff'}}>
            {/* Left: brand */}
            <Logo themeProp={props.themeProp} />

            {/* Right: actions */}
            <div className="top-bar-actions">
                <ThemeSlider themeProp={props.themeProp} setThemeProp={props.setThemeProp} />

                <LogOutIcon themeProp={props.themeProp} />

                <button className="download-pdf-btn" onClick={() => props.onClick()}>
                    <DownloadSvg themeProp={props.themeProp} />
                    <h3 style={{
                        fontWeight: 'bold',
                        color: !props.themeProp ? 'black' : 'white'
                    }}>PDF</h3>
                </button>
            </div>
        </div>
    )
}

export default TopBarDiv;
