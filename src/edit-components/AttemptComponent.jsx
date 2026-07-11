import { useState } from 'react';
import './resumeEditor.css';
import InputBlock from '../edit-components/Edit-input-block';
import InputField from '../edit-components/Input-field';
import Dates from '../edit-components/Dates';
import Description from '../edit-components/Description';
import AddBtnDiv from '../edit-components/AddBtn';
import BottomBar from '../edit-components/BottomBar';
import SummaryComponentDiv from '../edit-components/ArraySummary';
import AnimatedHeight from '../edit-components/AnimatedHeight';


const BigComponent = (props) => {
    const [show, setShow] = useState(props.singleObject ? true : false);
    const [index, setIndex] = useState(props.singleObject ? 0 : -1);
    const [tempEd, setTempEd] = useState({});

    // Unique id = larger than any existing entry's, so added entries never collide
    // with each other or the demo data (which prevented React's duplicate-key warning).
    const nextId = (arr) => (arr.length ? Math.max(...arr.map(i => Number(i.id) || 0)) + 1 : 0);

    function addBtnReplacement() {
      // Deep-copy the template each time so multiple added entries don't share one
      // mutable object reference (which made editing one edit all of them). A shallow
      // spread would still share the nested description/links arrays, so copy those too.
      const template = props.addBtnObject;
      const newEntry = { ...template, id: nextId(props.array) };
      if (Array.isArray(template.description)) newEntry.description = [];
      if (Array.isArray(template.links)) newEntry.links = [];
      props.setArray([...props.array, newEntry]);
      setShow(true);
      setIndex(props.array.length);
    };
    
    return (
        <InputBlock name={props.name} icon={props.icon} arr={props.array} setArr={props.setArray} themeProp = {props.themeP}>
            {/* One always-mounted container animates its height between the edit FORM
                and the item LIST, so swapping them is smooth (no remount flicker/snap).
                The `key` makes React cross-fade the inner content when it swaps. */}
            <AnimatedHeight>
              {show && props.array[index] ? (
                <div
                  key="form"
                  className='block-wrapper'
                  style={{backgroundColor: !props.themeP ? '#fff' : '#504d75ff'}}
                >
                  {props.requirementsArray.map((obj, i) => (
                    /* `Dates` requirements have no `result`, so fall back to type+index
                       to keep keys defined + unique (fixes the missing-key warning). */
                    <div style={{width: 'inherit'}} key={obj.result || `${obj.type}-${i}`}>
                      {obj.type == 'InputField' && <InputField themeProp={props.themeP} initial={props.array[index][obj.result]} onChange={(e) => {props.updateFunc(e.target.value, props.array, props.setArray, index, `${obj.result}`)}} editTitle={obj.editTitle} importantClass={obj.importantClass} subtext={obj.subtext} type='text' placeholder={obj.placeholder} />}
                      {obj.type == 'Dates' && <Dates initialStart={props.array[index].startDate} initialEnd={props.array[index].endDate} startDateonChange={(e) => {props.updateFunc(e, props.array, props.setArray, index, 'startDate')}} endDateonChange={(e) => {props.updateFunc(e, props.array, props.setArray, index, 'endDate')}} />}
                      {obj.type == 'Description' && <Description themeProp={props.themeP} editTitle={obj.editTitle} placeholder={obj.placeholder} subtext={obj.subtext} description={props.array[index][obj.result]} type={obj.descType} onChange={(e) => {props.updateFunc(e, props.array, props.setArray, index, `${obj.result}`)}}
                        hidden={obj.hideField ? !!props.array[index][obj.hideField] : undefined}
                        onToggleHide={obj.hideField ? (val) => props.updateFunc(val, props.array, props.setArray, index, obj.hideField) : undefined}
                      />}
                    </div>
                  ))}
                 {!props.singleObject &&  <BottomBar
                    themeProp = {props.themeP}
                    onSave={() => {
                      setShow(false);
                      props.updateFunc(false, props.array, props.setArray, index, 'newValue');
                    }}
                    onCancel={() => {
                      if(props.array[index].newValue) props.setArray(props.array.filter(item => item.newValue === false));
                      else {
                        // Restore the pre-edit snapshot IN PLACE — the old
                        // filter-then-append moved the cancelled item to the END of
                        // the array, permanently reordering the section + the demo.
                        props.setArray(props.array.map(item => item.id === props.array[index].id ? tempEd : item));
                      };
                      setShow(false);
                    }}
                    onDelete={() => {
                      props.setArray(props.array.filter(item => item.id !== props.array[index].id));
                      setShow(false);
                    }}
                  />}
                </div>
              ) : (
                <div key="list">
                  {props.array.map(item => (
                    <li key={item.id}>
                      <SummaryComponentDiv
                        onHide={(value) => {
                          const index = props.array.findIndex(subItem => subItem.id === item.id);
                          props.updateFunc(value, props.array, props.setArray, index, 'hidden');
                        }}
                        name={item.title}
                        initial={item.hidden}
                        themeProp={props.themeP}
                        onClick={() => {
                          setShow(true);
                          setIndex(props.array.findIndex(subItem => subItem.id === item.id));
                          setTempEd(item);
                        }}
                      />
                    </li>
                  ))}
                  <AddBtnDiv themeProp={props.themeP} name={props.name} onClick={addBtnReplacement}/>
                </div>
              )}
            </AnimatedHeight>
        </InputBlock>
    )
}

export default BigComponent;
