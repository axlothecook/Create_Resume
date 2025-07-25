import './resumeEditor.css';
import DownloadSvg from '../components/Download';
import DarkThemeIcon from '../components/DarkTheme';
import LightThemeIcon from '../components/LightTheme';
import LogOutIcon from '../components/LogOut';
//
const TopBarDiv = (props) => {
    return (
        <>
            <div className="top-bar" style={{backgroundColor: !props.themeProp ? '#827eafff' : '#5e59a8ff'}}>
                <LogOutIcon themeProp={props.themeProp} />

                <div className="theme-box" onClick={() => props.setThemeProp(!props.themeProp)}>
                    {!props.themeProp && <LightThemeIcon themeProp={props.themeProp} />}
                    {props.themeProp && <DarkThemeIcon themeProp={props.themeProp} />}
                </div>

                <div className='download-pdf-btn-div'>
                    <button className="download-pdf-btn" onClick={() => {
                        props.onClick();
                    }}>
                        <DownloadSvg themeProp={props.themeProp} />
                        <h3 style={{
                            fontWeight: 'bold',
                            color: !props.themeProp ? 'black' : 'white'
                        }}>PDF</h3>
                    </button>
                </div>
            </div>
        </>
    )
}

export default TopBarDiv;