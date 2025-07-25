import { useState } from 'react';
import './resumeEditor.css';
import TabOpenSvg from '../components/TabOpen';
import TabClosedSvg from '../components/TabClosedSvg';

const SummaryComponentDiv = (props) => {
    const [toggle, setToggle] = useState(props.initial);

    return (
        <div className='summary-div' style={{backgroundColor: !props.themeProp ? '#fff' : '#504d75ff'}}>
            <div className='clickable-summary-div-child-for-expansion' onClick={props.onClick}>
                <h3 style={{color: !props.themeProp ? 'black' : '#ccc'}}>{props.name}</h3>
            </div>
            {toggle && 
            <div className='overlaying-visibility-svg-wrapper' onClick={() => {
                props.onHide(false);
                setToggle(false);
            }}>
                <TabClosedSvg />
            </div>}

            {!toggle && 
            <div className='overlaying-visibility-svg-wrapper' onClick={() => {
                props.onHide(true);
                setToggle(true);
            }}>
                <TabOpenSvg />
            </div >}
        </div>
    )
};

export default SummaryComponentDiv;