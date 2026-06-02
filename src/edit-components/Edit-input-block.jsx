import { useState } from 'react';
import './resumeEditor.css';
import DropdownSvg from '../components/Dropdown';

const InputBlock = (props) => {
    const [tracker, setTracker] = useState(false);
    return (
        <div className= 'edit-info-big-box'>
            <div 
                className={tracker ? 'edit-info-title-with-dropdown-open' : 'edit-info-title-with-dropdown'} 
                style={{backgroundColor: !props.themeProp ? '#fff' : '#504d75ff'}}
                onClick={() => {setTracker(!tracker)}}>
              {props.icon}
              <h2 style={{fontWeight: 'bold'}}>{props.name}</h2>
              <DropdownSvg rotated={tracker} />
            </div>
            {/* Slide open/closed: grid-template-rows animates 0fr -> 1fr so the height
                transitions smoothly without needing to measure the content (gameshop-style). */}
            <div className={tracker ? 'dropdown-slide dropdown-slide-open' : 'dropdown-slide'}>
              <div className='dropdown-slide-inner'>
                {props.children}
              </div>
            </div>
        </div>
    )
}

export default InputBlock;