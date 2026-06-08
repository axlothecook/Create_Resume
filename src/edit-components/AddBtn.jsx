// import { useState } from 'react';
import AddSvg from '../components/Add-Svg';
import './resumeEditor.css';

const AddBtnDiv = (props) => {
    return (
        <div 
            className='add-btn-wrapper' 
            style={{backgroundColor: !props.themeProp ? '#fff' : '#504d75ff'}}>
            <button 
                className="add-btn" 
                style={{
                    backgroundColor: !props.themeProp ? '#fff' : '#5951adff',
                    // Dark mode: white border (on the purple bg); light mode keeps the
                    // subtle grey ring.
                    border: !props.themeProp ? '3px solid #eef1f3' : '3px solid #fff'
                }}
                onClick={props.onClick}>
                <AddSvg />
                {props.name}
            </button>
        </div>
    )
};

export default AddBtnDiv;