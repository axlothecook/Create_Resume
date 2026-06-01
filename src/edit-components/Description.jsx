import './resumeEditor.css';
import TextareaAutosize from 'react-textarea-autosize';
import EditSvg from '../components/Edit';
import TrashSvg from '../components/Trash';
import TickSvg from '../components/Tick';
import CancelChangeSvg from '../components/CancelChange';
import { useEffect, useState } from 'react';

const Description = (props) => {
    const [listArr, setListArr] = useState(props.description);
    // The text currently typed in the "add new bullet" box. A plain string so the
    // handlers never crash on `undefined` when Add is clicked before typing.
    const [newText, setNewText] = useState('');
    // The text being edited for the currently-selected existing bullet.
    const [editText, setEditText] = useState('');
    const [selectedId, setSelectedId] = useState(-1);

    // Generate an id larger than any existing bullet's, so re-adds after the
    // parent has saved (and this component remounted) never collide.
    const nextId = (arr) => (arr.length ? Math.max(...arr.map(i => Number(i.id) || 0)) + 1 : 0);

    // Re-sync the local list when the parent swaps in a different entry's
    // description (e.g. when the user opens a different Experience item).
    useEffect(() => {
        setListArr(props.description);
        setSelectedId(-1);
    }, [props.description]);

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
                                onChange={(e) => setEditText(e.target.value)}
                                readOnly={selectedId !== item.id}
                            />

                            {selectedId !== item.id && <div onClick={() => {
                                setSelectedId(item.id);
                                setEditText(item.text);
                            }}>
                                <EditSvg width={'13px'} height={'13px'} color={'black'}  />
                            </div>}

                            {selectedId === item.id && <div onClick={() => {
                                // Build a NEW array (immutable update) so React re-renders
                                // and the parent receives a fresh reference.
                                const updated = listArr.map(thing =>
                                    thing.id === item.id ? { ...thing, text: editText } : thing
                                );
                                setListArr(updated);
                                props.onChange(updated);
                                setSelectedId(-1);
                            }}>
                                <TickSvg />
                            </div>}

                            {selectedId === item.id && <div onClick={() => {
                                // Cancel: discard the edit, leave the list untouched.
                                setSelectedId(-1);
                                setEditText('');
                            }}>
                                <CancelChangeSvg />
                            </div>}

                            <div onClick={() => {
                                const trimmed = listArr.filter(itemToStay => itemToStay.id !== item.id);
                                setListArr(trimmed);
                                props.onChange(trimmed);
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
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                />
                <button className='add-desc-to-list-btn' onClick={() => {
                    if (!newText.trim()) return; // nothing to add
                    const updated = [...listArr, { id: nextId(listArr), text: newText }];
                    setListArr(updated);
                    props.onChange(updated);
                    setNewText('');
                }}>Add</button>
            </div>
        </div>
    )
}

export default Description;
