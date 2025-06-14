import './resumeComponents.css';

const GeneralInfoBox = (props) => {
    const today = new Date();
    const date = `0${today.getDate()}/0${today.getMonth() + 1}/${today.getFullYear()}`;
    function ongoingChecker(e) {
        const enteredDate = `0${e.$D}/0${(e.$M + 1)}/${e.$y}`;
        if(!e) return '';
        if(date === enteredDate) {
            return 'present';
        } else {
            return `0${(e.$M + 1)}/${e.$y}`;
        }
    };
    
    return (
        <div className='resume-info-box' style={{ 
                paddingBottom: (props.assumeStyle.underlined ? '2rem' : 'none'), 
                borderBottom: (props.assumeStyle.underlined ? '1px solid black' : 'none')
            }}>
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
                                {!item.links && <h4 style={{fontFamily: props.assumeStyle.font}}>{item.subtext}</h4>}
                                {item.links && item.links.map((subItem) => (
                                    <a key={subItem.id} style={{fontFamily: props.assumeStyle.font}}  target='_blank' href={subItem.text}>
                                        {subItem.text}
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
        </div>
    )
}

export default GeneralInfoBox;