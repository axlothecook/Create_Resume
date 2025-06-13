import { useState } from 'react';
import './resumeEditor.css';
import DropdownSvg from '../components/Dropdown';

const PersonalDetailsDiv = (props) => {
    const [tracker, setTracker] = useState(false);

    return (
        <div className= 'edit-info-big-box'>
            <div className={tracker ? 'edit-info-title-with-dropdown-open' : 'edit-info-title-with-dropdown'} onClick={() => {setTracker(!tracker)}}>
              <h2>Personal Detail</h2>
              <DropdownSvg rotated={tracker} />
            </div>
            {tracker && props.children}
        </div>
    )
};

export default PersonalDetailsDiv;