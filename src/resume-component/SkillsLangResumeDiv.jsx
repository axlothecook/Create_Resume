import './resumeComponents.css';

const SkillResumeDiv = (props) => {
    return (
        <div className='resume-info-box-lang' style={{ 
                paddingBottom: (props.assumeStyle.underlined ? (props.assumeStyle.gridView ? '0' : '2rem') : 'none'), 
                borderBottom: (props.assumeStyle.underlined ?  (props.assumeStyle.gridView ? 'none' : '1px solid black') : 'none')
            }}>
            <div className='resume-title-box' style={{ 
                backgroundColor: (props.assumeStyle.underlined ? 'transparent' : props.setTxtClr(props.assumeStyle.color))}}>
                <h3 style={{
                    fontFamily: props.assumeStyle.font,
                    color: (props.assumeStyle.underlined ? 'black' : props.assumeStyle.color),
                    textAlign: (props.assumeStyle.underlined ? 'left' : 'center'),
                }}>Skills & Language</h3>
            </div>
            <div className='resume-skills-n-languages-details-box'>
                <div className='resume-skill-lang-box-parent'>
                    <h3 style={{
                            fontFamily: props.assumeStyle.font,
                            fontWeight: 300
                        }}>Technical Skills</h3>
                    <div className="resume-skill-box-child">
                        <h4 style={{
                            fontFamily: props.assumeStyle.font}}>{props.skillArr}</h4>
                    </div>
                </div>
                <div className='resume-skill-lang-box-parent'>
                    <h3 style={{
                            fontFamily: props.assumeStyle.font,
                            fontWeight: 300
                        }}>Language</h3>
                    <div className="resume-language-box-child">
                        <h4 style={{fontFamily: props.assumeStyle.font}}>{props.langArr}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkillResumeDiv;