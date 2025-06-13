import { useState } from "react";
import './index.css'
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Practice = () => {
    // const [test, setTest] = useState({
    //     height: '30px',
    //     overflow: 'hidden'
    // });
    
    const [test2, setTest2] = useState(false);
    
    return (
        <>
            {/* <div className="div-testing">
                <button className="test-btn" onClick={() => { setTest('blue'); }}>Blue</button>
                <div className="square" style={{backgroundColor: test}}></div>
                <button className="test-btn" onClick={() => { setTest('red'); }} >Red</button>
            </div>
            <div className="div-testing">
                <button className="test-btn" onClick={() => setTest({
                    height: 'fit-content',
                    overflow: 'show'
                })}>Expand</button>
                <div className="square" style={{
                    height: test.height,
                    overflow: test.overflow
                }}>
                    <h2>Some special text</h2>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima 
                        animi fuga perferendis eaque neque voluptate aperiam aliquid quaerat 
                        nemo cumque placeat vero sed non, quisquam facere voluptatibus molestias 
                        ducimus et.
                    </p>
                </div>
                <button className="test-btn" onClick={() => setTest({
                    height: '30px',
                    overflow: 'hidden'
                })}>Go Small</button>
            </div> */}

            <div 
            className="parent" 
            onClick={() => {setTest2(!test2)}}>
                <div className="child">
                    <h2>Random Title</h2>
                    <div className="icon" style={{transform: test2 ? 'rotate(90deg)' : 'rotate(0deg)'}}>
                        ###
                        </div>
                </div>
                <div className= {test2 ? 'hidden-child-show' : 'hidden-child'} >
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                        Iste, facere. Voluptatum nostrum cumque veritatis sint rem illo 
                        adipisci ab molestiae eligendi. Esse laboriosam recusandae vitae 
                        necessitatibus et quia aliquam ratione.
                    </p>
                </div>
            </div>

            <div className="testing">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker />
                </LocalizationProvider>
            </div>



            {/* <button className="wierdBtn" >A button</button> */}
        </>
    )
}

export default Practice;