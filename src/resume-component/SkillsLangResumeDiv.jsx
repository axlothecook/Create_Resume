import './resumeComponents.css';

const SkillResumeDiv = (props) => {
    return (
        <div className='resume-info-box-lang'>
            <div className='resume-title-box' style={{ 
                backgroundColor: (props.assumeStyle.underlined ? 'transparent' : props.setTxtClr(props.assumeStyle.color))}}>
                <h3 style={{
                    fontFamily: props.assumeStyle.font,
                    color: (props.assumeStyle.underlined ? 'black' : props.assumeStyle.color),
                    textAlign: 'center', // always centred, matching the other section titles
                }}>SKILLS & LANGUAGES</h3>
            </div>
            <div className='resume-skills-n-languages-details-box'>
                {/* Each sub-group only shows when it has entries — so a hidden group
                    (passed as an empty array) drops out, heading and all. */}
                {props.skillArr.length !== 0 &&
                <div className='resume-skill-lang-box-parent'>
                    <h3 style={{
                            fontFamily: props.assumeStyle.font,
                            fontWeight: 600
                        }}>Technical Skills</h3>
                    <div className="resume-skill-box-child">
                        <h4 style={{
                            fontFamily: props.assumeStyle.font}}>{props.skillArr.map(item => {
                                return item.text;
                            }).join(', ')}</h4>
                    </div>
                </div>}
                {props.langArr.length !== 0 &&
                <div className='resume-skill-lang-box-parent'>
                    <h3 style={{
                            fontFamily: props.assumeStyle.font,
                            fontWeight: 600
                        }}>Language</h3>
                    <div className="resume-language-box-child">
                        <h4 style={{fontFamily: props.assumeStyle.font}}>{props.langArr.map(item => {
                            return item.text;
                        }).join(', ')}</h4>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default SkillResumeDiv;