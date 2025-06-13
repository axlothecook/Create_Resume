import { useState } from 'react';
import './resumeEditor.css';
import TrashSvg from '../components/Trash';

const StickyDiv = () => {
    const[clrResumeTracker, setClrResumeTracker] = useState(false);
    const[loadExmTracker, setLoadExmTracker] = useState(false);

    function btnFunc() {
        console.log('boutta delete resume');
    };

    return (
        <div className='sticky-div'>
            <button className='clear-resume-btn' onClick={btnFunc} >
                <TrashSvg color={'#b91c1c'} width={'15px'} height={'15px'}/>
                <h3>Clear Resume</h3>
            </button>
            <button className='load-example-btn'>
                <h3>Load Example</h3>
            </button>
        </div>
    )
}

export default StickyDiv;