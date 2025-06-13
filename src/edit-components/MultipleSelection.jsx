import { useState } from 'react';
import './resumeEditor.css';

const MultipleSelection = (props) => {
    return (
        <div className='edit-info-box'>
            <div className='edit-title-box-no-recommended '>
            <h4>{props.editTitle}</h4>
            </div>
            <input className='edit-input' placeholder={props.placeholder} />
        </div>
    )
}

export default MultipleSelection;