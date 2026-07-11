import './resumeComponents.css';
import { formatResumeDate, todayString, toHref } from '../utils/resumeFormat';

const GeneralInfoBox = (props) => {
    // Shared date formatter (utils/resumeFormat) — also handles the ISO strings that
    // saved dates become after the JSON round-trip (used to render "NaN/undefined").
    const date = todayString();
    const ongoingChecker = (e) => formatResumeDate(e, date);

    return (
        <div className='resume-info-box'>
            {props.arr.length !== 0 && <div className='resume-title-box' style={{backgroundColor: (props.assumeStyle.underlined ? 'transparent' : props.setTxtClr(props.assumeStyle.color))}}>
                <h3 style={{
                    fontFamily: props.assumeStyle.font,
                    color: (props.assumeStyle.underlined ? 'black' : props.assumeStyle.color)
                }}>{props.resumeTitle}</h3>
            </div>}
            {props.arr.map(item => (
                <div key={item.id}>
                    {!item.hidden && <div className='resume-details-box'>
                        <div className='left-date-location-box'>
                            <div className="resume-date">
                                <h4 style={{fontFamily: props.assumeStyle.font}}>{ongoingChecker(item.startDate)} - {ongoingChecker(item.endDate)}</h4>
                            </div>
                            <div className="resume-location">
                                {/* links?.length (not just `links`): an entry with an EMPTY links
                                    array (every freshly-added project) must still show its
                                    location line, not silently blank the column. */}
                                {!item.links?.length && <h4 style={{fontFamily: props.assumeStyle.font}}>{item.subtext}</h4>}
                                {!!item.links?.length && item.links.map((subItem) => (
                                    <a key={subItem.id} className='link-item' style={{fontFamily: props.assumeStyle.font}} target='_blank' rel='noopener noreferrer' href={toHref(subItem.text)}>
                                        {/* Show the human label; fall back to the raw URL only
                                            when no label was entered, so a link never renders blank. */}
                                        {subItem.name?.trim() ? subItem.name : subItem.text}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className='right-name-position-desc-box'>
                            <div className="resume-place">
                                <h4 style={{fontFamily: props.assumeStyle.font}}>{item.title}</h4>
                            </div>
                            <div className="resume-position">
                                <h4 style={{fontFamily: props.assumeStyle.font}}><i>{item.subtitle}</i></h4>
                            </div>
                            <ul className="resume-description">
                                {item.description.map((subItem) => (
                                    <li className='list-item' key={subItem.id} style={{fontFamily: props.assumeStyle.font}}>
                                        <div className='list-dot'></div>
                                        {subItem.text} 
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>}
                </div>
                
            ))}
             {/* {props.assumeStyle.underlined && <hr style={{width: '100%'}} />} */}
        </div>
    )
}

export default GeneralInfoBox;