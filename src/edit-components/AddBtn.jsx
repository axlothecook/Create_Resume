// import { useState } from 'react';
import AddSvg from '../components/Add-Svg';
import './resumeEditor.css';

const AddBtnDiv = (props) => {
    return (
        <div className='add-btn-wrapper'>
            <button className="add-btn" onClick={props.onClick}>
                <AddSvg />
                {props.name}
            </button>
        </div>
    )
};

export default AddBtnDiv;