import './resumeEditor.css';
import TextareaAutosize from 'react-textarea-autosize';
import EditSvg from '../components/Edit';
import TrashSvg from '../components/Trash';
import TickSvg from '../components/Tick';
import CancelChangeSvg from '../components/CancelChange';
import { useState } from 'react';

const Description = (props) => {
    const [listArr, setListArr] = useState(props.description);
    const [text, setText] = useState();
    const [counter, setCounter] = useState(0);
    const [selectedId, setSelectedId] = useState(-1);

    function pushBulletPoint(e) {
        setText(e);
    };

    return (
        <div className='edit-info-box'>
            <div className='edit-title-box'>
                <h4>{props.editTitle ? props.editTitle : 'Description'}</h4>
                <h4 className='important-text'>*recommended style of no more than 3 bullet points</h4>
            </div>
            <ul className="edit-list">
                {listArr.map((item) => (
                    <li key={item.id}>
                        <div className='edit-list-item'>
                            <TextareaAutosize 
                                className='edit-desc-list-item'
                                minRows={1} 
                                placeholder='Add a bullet point'
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
                                    if(thing.id === item.id) thing.text = text.target.value;
                                });
                                props.onChange(listArr);
                                setSelectedId(-1);
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
                    className='edit-input-description'
                    minRows={1} 
                    placeholder='Add a bullet point'
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