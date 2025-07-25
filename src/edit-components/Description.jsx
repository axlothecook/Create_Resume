import './resumeEditor.css';
import TextareaAutosize from 'react-textarea-autosize';
import EditSvg from '../components/Edit';
import TrashSvg from '../components/Trash';
import TickSvg from '../components/Tick';
import CancelChangeSvg from '../components/CancelChange';
import { useState } from 'react';

const Description = (props) => {
    console.log('desc:');
    console.log(props.description);
    const [listArr, setListArr] = useState(props.description);
    const [text, setText] = useState();
    const [counter, setCounter] = useState(0);
    const [selectedId, setSelectedId] = useState(-1);

    console.log('listArr:');
    console.log(listArr);
    console.log('selectedId:');
    console.log(selectedId);

    function pushBulletPoint(e) {
        setText(e);
    };
    
    return (
        <div className='edit-info-box'>
            <div className='edit-title-box'>
                <h4>{props.editTitle ? props.editTitle : 'Description'}</h4>
                <h4 className='important-text'>{props.subtext ? props.subtext : props.subtext !== null ? '*recommended style of no more than 3 bullet points' : ''}</h4>
            </div>
            <ul className={props.type === 'skill' ? 'edit-skill-list' : "edit-list"}>
                {listArr.map((item) => (
                    <li key={item.id}>
                        <div style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}} className={props.type === 'skill' ? 'edit-skill-list-item' : "edit-list-item"}>
                            <TextareaAutosize 
                                style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}}
                                className='edit-desc-list-item'
                                minRows={1} 
                                placeholder= {props.placeholder ? props.placeholder : 'Add a bullet point'}
                                autoFocus 
                                type='text'
                                defaultValue={item.text}
                                onChange={pushBulletPoint}
                                readOnly={selectedId !== item.id}
                            />

                            {selectedId !== item.id && <div onClick={() => {
                                setSelectedId(item.id);
                            }}>
                                <EditSvg width={'13px'} height={'13px'} color={'black'}  />
                            </div>}

                            {selectedId === item.id && <div onClick={() => {
                                listArr.filter(thing => {
                                    console.log(thing);
                                    console.log('text:');
                                    console.log(text);
                                    console.log(selectedId !== item.id);
                                    console.log(selectedId === item.id);
                                    console.log(selectedId);
                                    console.log(item.id);
                                    if(thing.id === item.id) thing.text = text.target.value;
                                    
                                });
                                console.log(item.id);
                                props.onChange(listArr);
                                setSelectedId(-1);
                                console.log(selectedId !== item.id);
                                console.log(selectedId);
                                console.log(item.id);
                            }}>
                                <TickSvg />
                            </div>}

                            {selectedId === item.id && <div onClick={() => {
                                text.target.value = listArr.filter(thing => thing.id === item.id)[0].text;
                                props.onChange(listArr);
                                setSelectedId(-1);
                            }}>
                                <CancelChangeSvg />
                            </div>}

                            <div onClick={() => {
                                setListArr(listArr.filter(itemToStay => itemToStay.id !== item.id));
                                props.onChange(listArr.filter(itemToStay => itemToStay.id !== item.id));
                            }}>
                                <TrashSvg color={'black'} width={'15px'} height={'15px'} />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="edit-desc-box">
                <TextareaAutosize 
                    style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}}
                    className='edit-input-description'
                    minRows={1} 
                    placeholder= {props.placeholder ? props.placeholder : 'Add a bullet point'}
                    autoFocus 
                    type='text'
                    onChange={pushBulletPoint}
                />
                <button className='add-desc-to-list-btn' onClick={() => {
                    setCounter(counter + 1);
                    setListArr([
                        ...listArr,
                        { id: counter, text: text.target.value }
                    ]);
                    props.onChange([
                        ...listArr,
                        { id: counter, text: text.target.value }
                    ]);
                    text.target.value = '';
                }}>Add</button>
            </div>
        </div>
    )
}

export default Description;