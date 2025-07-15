import './resumeEditor.css';
import TrashSvg from '../components/Trash';

const StickyDiv = (props) => {
    return (
        <div className='sticky-div'>
            <button className='clear-resume-btn' onClick={() => {
                props.emptyPersonalDetails();
                props.emptyEducation();
                props.emptyExperience();
                props.emptySkills();
                props.emptyPProject();
            }}>
                <TrashSvg color={'#b91c1c'} width={'15px'} height={'15px'}/>
                <h3 style={{fontWeight: 'bold'}}>Clear Resume</h3>
            </button>
            <button className='load-example-btn' onClick={() => {
                props.fillPersonalDetails();
                props.fillEducation();
                props.fillExperience();
                props.fillSkills();
                props.fillProject();
            }}>
                <h3 style={{fontWeight: 'bold'}}>Load Example</h3>
            </button>
        </div>
    )
}

export default StickyDiv;