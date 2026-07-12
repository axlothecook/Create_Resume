import './resumeComponents.css';
import { toHref } from '../utils/resumeFormat';

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
                    <div className='resume-skill-title-row'>
                        <h3 style={{
                                fontFamily: props.assumeStyle.font,
                                fontWeight: 600
                            }}>Technical Skills</h3>
                        {/* Optional portfolio link, clickable, sitting next to the title,
                            with a plain "Full skill list at" lead-in before it. */}
                        {props.portfolioLink && <span
                            className='resume-skill-portfolio-lead'
                            style={{fontFamily: props.assumeStyle.font}}
                        >Full skill list at</span>}
                        {props.portfolioLink && <a
                            className='link-item resume-skill-portfolio-link'
                            style={{fontFamily: props.assumeStyle.font}}
                            target='_blank' rel='noopener noreferrer'
                            href={toHref(props.portfolioLink)}
                        >{props.portfolioLinkName?.trim() ? props.portfolioLinkName : props.portfolioLink}</a>}
                    </div>
                    <div className="resume-skill-box-child">
                        <h4 style={{
                            fontFamily: props.assumeStyle.font}}>{props.skillArr.map(item => {
                                return item.text;
                            }).join(', ')}</h4>
                    </div>
                </div>}
                {/* Tools: sits between Technical Skills and Languages. Same shape as the
                    other two (own visibility eye in the editor; comma-joined line). */}
                {(props.toolArr?.length ?? 0) !== 0 &&
                <div className='resume-skill-lang-box-parent'>
                    <h3 style={{
                            fontFamily: props.assumeStyle.font,
                            fontWeight: 600
                        }}>Tools</h3>
                    <div className="resume-language-box-child">
                        <h4 style={{fontFamily: props.assumeStyle.font}}>{props.toolArr.map(item => {
                            return item.text;
                        }).join(', ')}</h4>
                    </div>
                </div>}
                {props.langArr.length !== 0 &&
                <div className='resume-skill-lang-box-parent'>
                    <h3 style={{
                            fontFamily: props.assumeStyle.font,
                            fontWeight: 600
                        }}>Languages</h3>
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