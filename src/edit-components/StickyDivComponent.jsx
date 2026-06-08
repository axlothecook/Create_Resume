import './resumeEditor.css';
import TrashSvg from '../components/Trash';
import ReloadSvg from '../components/Reload';

const StickyDiv = (props) => {
    // The "selected" button (last clicked) gets the recessed shade; the other matches
    // the container so it reads as unselected. Consistent in both themes.
    const selectedBg = !props.themeProp ? '#eef1f3' : '#504d75ff';
    const unselectedBg = !props.themeProp ? '#fff' : '#3c3a58ff';
    const clearBg = props.selection === 'clear' ? selectedBg : unselectedBg;
    const loadBg = props.selection === 'load' ? selectedBg : unselectedBg;

    return (
        <div
            className='sticky-div'
            style={{backgroundColor: !props.themeProp ? '#fff' : '#3c3a58ff'}}>
            <button
                style={{backgroundColor: clearBg}}
                className='clear-resume-btn'
                onClick={() => {
                props.setSelection('clear');
                props.emptyPersonalDetails();
                props.emptyEducation();
                props.emptyExperience();
                props.emptySkills();
                props.emptyPProject();
            }}>
                <TrashSvg color={'#b91c1c'} width={'15px'} height={'15px'}/>
                <h3 style={{fontWeight: 'bold'}}>Clear Resume</h3>
            </button>
            <button
            style={{backgroundColor: loadBg}}
                className='load-example-btn'
                onClick={() => {
                props.setSelection('load');
                props.fillPersonalDetails();
                props.fillEducation();
                props.fillExperience();
                props.fillSkills();
                props.fillProject();
            }}>
                <ReloadSvg color={'rgb(14, 55, 78)'} width={'15px'} height={'15px'} />
                <h3 style={{fontWeight: 'bold'}}>Load Example</h3>
            </button>
        </div>
    )
}

export default StickyDiv;