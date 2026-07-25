import './resumeEditor.css';
import TextareaAutosize from 'react-textarea-autosize';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import EditSvg from '../components/Edit';
import TrashSvg from '../components/Trash';
import TickSvg from '../components/Tick';
import CancelChangeSvg from '../components/CancelChange';
import TabOpenSvg from '../components/TabOpen';
import TabClosedSvg from '../components/TabClosedSvg';
import SortableEntryRow from '../edit-components/SortableEntryRow';
import { useEffect, useState } from 'react';

const Description = (props) => {
    // Link lists ('Links to the...') get a second field: a human label ("name")
    // that becomes the visible, clickable text instead of the raw URL.
    const isLink = props.type === 'link';
    // Only plain bullet lists reorder by drag (item #2). Link rows are two stacked
    // fields (a grip would fight the pens) and skill chips flow in a grid, so both
    // keep their existing layout untouched.
    const isPlainList = !isLink && props.type !== 'skill';
    // Default to [] — a résumé saved BEFORE a list existed (e.g. `toolList`, added later)
    // has no such key, so `props.description` arrives undefined and every `.map` below
    // threw, taking the whole editor down when that CV was loaded.
    const [listArr, setListArr] = useState(props.description ?? []);
    // The text currently typed in the "add new bullet" box. A plain string so the
    // handlers never crash on `undefined` when Add is clicked before typing.
    const [newText, setNewText] = useState('');
    // The label typed in the "add new" box for link lists (parallel to newText).
    const [newName, setNewName] = useState('');
    // The text being edited for the currently-selected existing bullet.
    const [editText, setEditText] = useState('');
    // The label being edited for the currently-selected existing link.
    const [editName, setEditName] = useState('');
    // `null` = no bullet is being edited. MUST NOT be a number: real bullet ids can
    // be any number (the example data uses -1/-2), and the old `-1` sentinel made a
    // bullet with id -1 render permanently in its tick/X editing state.
    const [selectedId, setSelectedId] = useState(null);
    // For LINK lists only: which field of the selected item is being edited —
    // 'name' (label) or 'text' (URL). The two fields have separate pens so they
    // edit independently. null for non-link lists / when nothing is being edited.
    const [selectedField, setSelectedField] = useState(null);

    // Generate an id larger than any existing bullet's, so re-adds after the
    // parent has saved (and this component remounted) never collide.
    const nextId = (arr) => (arr.length ? Math.max(...arr.map(i => Number(i.id) || 0)) + 1 : 0);

    // Same sensor recipe as the other reorder spots (pointer / touch / keyboard,
    // small threshold so a tap on the grip isn't already a drag).
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    // Drop a dragged bullet into its new slot. Same commit pattern as every other
    // mutation here: build the new array, set it locally AND report it up. Ids are
    // String()ed — the demo data uses negative ids and nextId starts at 0.
    function handleBulletDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = listArr.findIndex(item => String(item.id) === active.id);
        const newIndex = listArr.findIndex(item => String(item.id) === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const updated = arrayMove(listArr, oldIndex, newIndex);
        setListArr(updated);
        props.onChange(updated);
    };

    // Re-sync the local list when the parent swaps in a different entry's
    // description (e.g. when the user opens a different Experience item).
    useEffect(() => {
        setListArr(props.description ?? []);
        setSelectedId(null);
        setSelectedField(null);
    }, [props.description]);

    return (
        <div className='edit-info-box'>
            <div className='edit-title-box'>
                <h4>{props.editTitle ? props.editTitle : 'Description'}</h4>
                <h4 className='important-text'>{props.subtext ? props.subtext : props.subtext !== null ? '*recommended style of no more than 3 bullet points' : ''}</h4>
                {/* Optional visibility eye (used by the Skills sub-groups) — toggles
                    whether this group shows in the résumé. */}
                {props.onToggleHide &&
                <div className='desc-visibility-toggle' onClick={() => props.onToggleHide(!props.hidden)}>
                    {props.hidden ? <TabClosedSvg /> : <TabOpenSvg />}
                </div>}
            </div>
            <ul className={props.type === 'skill' ? 'edit-skill-list' : "edit-list"}>
                {isLink ? listArr.map((item) => {
                    // A link row: two DISTINCT fields (label on top, URL below), each
                    // with its own pen so they edit independently. Only the URL row
                    // has the trash icon; deleting it removes the whole item (both).
                    const editingName = selectedId === item.id && selectedField === 'name';
                    const editingText = selectedId === item.id && selectedField === 'text';
                    // Commit the currently-edited field back into the list.
                    const commit = (field, value) => {
                        const updated = listArr.map(thing =>
                            thing.id === item.id ? { ...thing, [field]: value } : thing
                        );
                        setListArr(updated);
                        props.onChange(updated);
                        setSelectedId(null);
                        setSelectedField(null);
                    };
                    const startEdit = (field) => {
                        setSelectedId(item.id);
                        setSelectedField(field);
                        setEditName(item.name || '');
                        setEditText(item.text || '');
                    };
                    const cancel = () => { setSelectedId(null); setSelectedField(null); };
                    return (
                    <li key={item.id}>
                        {/* LABEL field row */}
                        <div style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}} className='edit-list-item edit-link-row'>
                            <TextareaAutosize
                                style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}}
                                className='edit-desc-list-item'
                                minRows={1}
                                placeholder='Link label (e.g. Archery website)'
                                type='text'
                                defaultValue={item.name}
                                onChange={(e) => setEditName(e.target.value)}
                                readOnly={!editingName}
                            />
                            {!editingName && <div onClick={() => startEdit('name')}>
                                <EditSvg width={'13px'} height={'13px'} color={'black'} />
                            </div>}
                            {editingName && <div onClick={() => commit('name', editName)}>
                                <TickSvg />
                            </div>}
                            {editingName && <div onClick={cancel}>
                                <CancelChangeSvg />
                            </div>}
                        </div>
                        {/* gap between the two fields */}
                        <div className='edit-link-gap'></div>
                        {/* LINK (URL) field row — carries the trash for the whole item */}
                        <div style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}} className='edit-list-item edit-link-row'>
                            <TextareaAutosize
                                style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}}
                                className='edit-desc-list-item'
                                minRows={1}
                                placeholder={props.placeholder ? props.placeholder : 'www.projectwebsite.com'}
                                type='text'
                                defaultValue={item.text}
                                onChange={(e) => setEditText(e.target.value)}
                                readOnly={!editingText}
                            />
                            {!editingText && <div onClick={() => startEdit('text')}>
                                <EditSvg width={'13px'} height={'13px'} color={'black'} />
                            </div>}
                            {editingText && <div onClick={() => commit('text', editText)}>
                                <TickSvg />
                            </div>}
                            {editingText && <div onClick={cancel}>
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
                    );
                }) : (() => {
                    // Plain bullet lists get a drag grip per row (SortableEntryRow);
                    // skill chips render the same rows but skip the wrapper entirely.
                    const bulletRows = listArr.map((item) => (
                    <li key={item.id}>
                        {(() => { const row = (
                        <div style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}} className={props.type === 'skill' ? 'edit-skill-list-item' : "edit-list-item"}>
                            <div className='edit-desc-fields'>
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
                            </div>

                            {/* Action icons live in their own cluster, divided from the text by a
                                rule (.edit-item-actions) so it's obvious where the editable text
                                ends and the buttons begin. Plain bullet rows widen the gaps and
                                normalize every icon to the eye's 20px ('bullet-actions'); the row
                                keeps its one-line height because view-mode text fades instead of
                                wrapping (see resumeEditor.css). */}
                            <div className={isPlainList ? 'edit-item-actions bullet-actions' : 'edit-item-actions'}>
                                {/* Per-item visibility eye (skill chips AND description bullets):
                                    hides this single entry from the résumé without deleting it. The
                                    GROUP eye (next to the heading) still hides the whole group. On
                                    bullets the eye unmounts while the row is being edited (only
                                    tick/X stay, for space). */}
                                {(props.type === 'skill' || (isPlainList && selectedId !== item.id)) && <div
                                    className='edit-item-eye'
                                    title={item.hidden ? 'Show in résumé' : 'Hide from résumé'}
                                    onClick={() => {
                                        const updated = listArr.map(thing =>
                                            thing.id === item.id ? { ...thing, hidden: !thing.hidden } : thing
                                        );
                                        setListArr(updated);
                                        props.onChange(updated);
                                    }}
                                >
                                    {item.hidden ? <TabClosedSvg /> : <TabOpenSvg />}
                                </div>}

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
                                        thing.id === item.id
                                            ? { ...thing, text: editText }
                                            : thing
                                    );
                                    setListArr(updated);
                                    props.onChange(updated);
                                    setSelectedId(null);
                                }}>
                                    <TickSvg />
                                </div>}

                                {selectedId === item.id && <div onClick={() => {
                                    // Cancel: discard the edit, leave the list untouched.
                                    setSelectedId(null);
                                    setEditText('');
                                }}>
                                    <CancelChangeSvg />
                                </div>}

                                {/* Trash also unmounts while a plain bullet is being edited. */}
                                {!(isPlainList && selectedId === item.id) && <div onClick={() => {
                                    const trimmed = listArr.filter(itemToStay => itemToStay.id !== item.id);
                                    setListArr(trimmed);
                                    props.onChange(trimmed);
                                }}>
                                    <TrashSvg color={'black'} width={'15px'} height={'15px'} />
                                </div>}
                            </div>
                        </div>
                        ); return isPlainList ? <SortableEntryRow id={String(item.id)}>{row}</SortableEntryRow> : row; })()}
                    </li>
                    ));
                    return isPlainList ? (
                        /* Only the vertical-axis lock here: the bullet <ul> has no scroll cap, so
   there is no scrollbar cascade to guard against (and restrictToParentElement
   would clamp the drag to the bullet's own row-sized <li>, freezing it). */
<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleBulletDragEnd} modifiers={[restrictToVerticalAxis]}>
                            <SortableContext items={listArr.map(item => String(item.id))} strategy={verticalListSortingStrategy}>
                                {bulletRows}
                            </SortableContext>
                        </DndContext>
                    ) : bulletRows;
                })()}
            </ul>
            <div className="edit-desc-box">
                <div className={isLink ? 'edit-link-fields' : 'edit-desc-fields'}>
                    {/* Link add-box: label field on top, URL below (matches the row order). */}
                    {isLink &&
                    <TextareaAutosize
                        style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}}
                        className='edit-input-description edit-link-name'
                        minRows={1}
                        placeholder='Link label (e.g. Archery website)'
                        type='text'
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />}
                    <TextareaAutosize
                        style={{backgroundColor: !props.themeProp ? '#eef1f3' : '#ccc'}}
                        className='edit-input-description'
                        minRows={1}
                        placeholder= {isLink ? (props.placeholder ? props.placeholder : 'www.projectwebsite.com') : (props.placeholder ? props.placeholder : 'Add a bullet point')}
                        autoFocus
                        type='text'
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                    />
                </div>
                <button className='add-desc-to-list-btn' onClick={() => {
                    if (!newText.trim()) return; // nothing to add
                    const updated = [...listArr, {
                        id: nextId(listArr),
                        text: newText,
                        ...(isLink ? { name: newName } : {})
                    }];
                    setListArr(updated);
                    props.onChange(updated);
                    setNewText('');
                    setNewName('');
                }}>Add</button>
            </div>
        </div>
    )
}

export default Description;
