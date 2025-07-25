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
                    border: !props.themeProp ? '3px solid #eef1f3' : '3px solid grey'
                }}
                onClick={props.onClick}>
                <AddSvg />
                {props.name}
            </button>
        </div>
    )
};

export default AddBtnDiv;