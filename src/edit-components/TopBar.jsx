import './resumeEditor.css';
import DownloadSvg from '../components/Download';
import DarkThemeIcon from '../components/DarkTheme';
import LightThemeIcon from '../components/LightTheme';
import LogOutIcon from '../components/LogOut';

const TopBarDiv = (props) => {
return (
    <>
        <div className="top-bar">
            <LogOutIcon />
            <DarkThemeIcon />
            <LightThemeIcon />

            <div className='download-pdf-btn-div'>
                <button className="download-pdf-btn" onClick={props.onClick()}>
                    <DownloadSvg />
                    <h3 style={{fontWeight: 'bold'}}>PDF</h3>
                </button>
            </div>
        </div>
    </>
)
}

export default TopBarDiv;