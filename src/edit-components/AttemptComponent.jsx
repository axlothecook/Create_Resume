import { useState } from 'react';
import './resumeEditor.css';
import InputBlock from '../edit-components/Edit-input-block';
import InputField from '../edit-components/Input-field';
import Dates from '../edit-components/Dates';
import Description from '../edit-components/Description';
import AddBtnDiv from '../edit-components/AddBtn';
import BottomBar from '../edit-components/BottomBar';
import SummaryComponentDiv from '../edit-components/ArraySummary';


const BigComponent = (props) => {
    const [show, setShow] = useState(false);
    const [index, setIndex] = useState(-1);
    const [counter, setCounter] = useState(0);
    const [tempEd, setTempEd] = useState({}); 
    console.log(props.requirementsArray)
    return (
        <InputBlock name={props.name} icon={props.icon} arr={props.array} setArr={props.setArray} >
            {show && 
              <div className='block-wrapper'>
                {props.requirementsArray.map(obj => (
                  <div key={obj.result}>
                    {obj.type == 'InputField' && <InputField initial={props.array[index][obj.result]} onChange={(e) => {props.updateFunc(e.target.value, props.array, props.setArray, index, `${obj.result}`)}} editTitle={obj.editTitle} importantClass={obj.importantClass} subtext={obj.subtext} type='text' placeholder={obj.placeholder} />}
                    {obj.type == 'Dates' && <Dates initialStart={props.array[index].startDate} initialEnd={props.array[index].endDate} startDateonChange={(e) => {props.updateFunc(e, props.array, props.setArray, index, 'startDate')}} endDateonChange={(e) => {props.updateFunc(e, props.array, props.setArray, index, 'endDate')}} />}
                    {obj.type == 'Description' && <Description description={props.array[index][obj.result]} onChange={(e) => {props.updateFunc(e, props.array, props.setArray, index, `${obj.result}`)}}/>}
                  </div>
                ))}
                <BottomBar 
                  onSave={() => {
                    setShow(false);
                    props.updateFunc(false, props.array, props.setArray, index, 'newValue');
                  }} 
                  onCancel={() => {
                    if(props.array[index].newValue) props.setArray(props.array.filter(item => item.newValue === false));
                    else {
                      const tempArr = props.array.filter(item => item.id !== props.array[index].id);
                      props.setArray([...tempArr, tempEd]);
                    };
                    setShow(false);
                  }}
                  onDelete={() => {
                    props.setArray(props.array.filter(item => item.id !== props.array[index].id));
                    setShow(false);
                  }}
                />
              </div>
            }
           {!show &&  
            <>
            {props.array.map(item => (
              <li key={item.id}>
                <SummaryComponentDiv onHide={(value) => {
                    const index = props.array.findIndex(subItem => subItem.id === item.id);
                    props.updateFunc(value, props.array, props.setArray, index, 'hidden');
                  }} name={item.source} initial={item.hidden} onClick={() => {
                    setShow(true);
                    setIndex(props.array.findIndex(subItem => subItem.id === item.id));
                    setTempEd(item);
                  }} 
                />
              </li>
            ))}
              <AddBtnDiv name={props.name} onClick={() => {
                props.addBtnObject.id = counter
                props.setArray([...props.array, props.addBtnObject]);
                setShow(true);
                setIndex(props.array.length);
                setCounter(counter + 1);
              }} />
            </>
          }
        </InputBlock>
    )
}

export default BigComponent;
