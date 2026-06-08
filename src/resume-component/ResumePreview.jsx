import PersonInfoDiv from './PersonInfo';
import GeneralInfoBox from './General-Info-Block';
import SkillResumeDiv from './SkillsLangResumeDiv';

// Renders a full résumé from a data bundle. Used both by the live editor preview and
// by the saved-CV card thumbnails (scaled down via CSS transform by the caller).
//
// `data` = { personalDetails: [..], education: [..], experience: [..], project: [..],
//            skill: [..], sectionOrder: [..], style: {..} } — the saved editor state.
// setSvgClr / setTxtClr are the brightness helpers from App (passed in so this stays
// a pure presentational component).
const ResumePreview = ({ data, setSvgClr, setTxtClr }) => {
    if (!data) return null;
    const style = data.style || {};
    const personal = (data.personalDetails && data.personalDetails[0]) || {};
    const education = data.education || [];
    const experience = data.experience || [];
    const project = data.project || [];
    const skill = (data.skill && data.skill[0]) || { skillList: [], languageList: [] };
    const sectionOrder = data.sectionOrder || ['project', 'experience', 'skill', 'education'];

    // A section renders only if it has a visible (non-hidden) item — so the card
    // preview matches the live demo + PDF (fully-hidden sections drop out).
    const sectionNode = (key) => {
        switch (key) {
            case 'education':
                return education.some(item => !item.hidden)
                    ? <GeneralInfoBox assumeStyle={style} setTxtClr={setTxtClr} resumeTitle='EDUCATION' arr={education} />
                    : null;
            case 'skill': {
                const skillsVisible = skill.skillList.length !== 0 && !skill.skillHidden;
                const langVisible = skill.languageList.length !== 0 && !skill.langHidden;
                return (skillsVisible || langVisible)
                    ? <SkillResumeDiv assumeStyle={style} setTxtClr={setTxtClr} skillArr={skillsVisible ? skill.skillList : []} langArr={langVisible ? skill.languageList : []} />
                    : null;
            }
            case 'experience':
                return experience.some(item => !item.hidden)
                    ? <GeneralInfoBox assumeStyle={style} setTxtClr={setTxtClr} resumeTitle='EXPERIENCE' arr={experience} />
                    : null;
            case 'project':
                return project.some(item => !item.hidden)
                    ? <GeneralInfoBox assumeStyle={style} setTxtClr={setTxtClr} resumeTitle='PERSONAL PROJECTS' arr={project} />
                    : null;
            default:
                return null;
        }
    };

    const visible = sectionOrder
        .map(key => ({ key, node: sectionNode(key) }))
        .filter(s => s.node !== null);

    return (
        <div className={style.resumeView}>
            <PersonInfoDiv assertStyle={style} setSvgClr={setSvgClr} object={personal} />
            <div className={style.resumeInfoParentBoxLeft} style={{
                padding: style.underlined ? (style.gridView ? '20px' : '0 25px 25px 25px') : '30px',
                gap: style.underlined ? '5px' : '20px',
            }}>
                {visible.map((s, i) => (
                    <div key={s.key} style={{ display: 'contents' }}>
                        {s.node}
                        {style.underlined && i < visible.length - 1 && <hr style={{ width: '100%' }} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResumePreview;
