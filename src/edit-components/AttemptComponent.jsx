import { useState } from 'react';
import './resumeEditor.css';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import InputBlock from '../edit-components/Edit-input-block';
import InputField from '../edit-components/Input-field';
import Dates from '../edit-components/Dates';
import Description from '../edit-components/Description';
import AddBtnDiv from '../edit-components/AddBtn';
import BottomBar from '../edit-components/BottomBar';
import SummaryComponentDiv from '../edit-components/ArraySummary';
import AnimatedHeight from '../edit-components/AnimatedHeight';
import SortableEntryRow from '../edit-components/SortableEntryRow';


const BigComponent = (props) => {
    const [show, setShow] = useState(props.singleObject ? true : false);
    const [index, setIndex] = useState(props.singleObject ? 0 : -1);
    const [tempEd, setTempEd] = useState({});

    // Same sensor recipe as the section reorder in App: pointer, touch (phones) and
    // keyboard, with a small activation threshold so a tap/click isn't read as a drag.
    const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
      useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    // Reorder this section's entries (item #2: drag an entry within its section).
    // Ids arrive as String(item.id) — real ids can be 0, which dnd-kit treats as falsy.
    function handleEntryDragEnd(event) {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = props.array.findIndex(item => String(item.id) === active.id);
      const newIndex = props.array.findIndex(item => String(item.id) === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      props.setArray(arrayMove(props.array, oldIndex, newIndex));
    };

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
                      {obj.type == 'Dates' && <Dates initialStart={props.array[index].startDate} initialEnd={props.array[index].endDate} startDateonChange={(e) => {props.updateFunc(e, props.array, props.setArray, index, 'startDate')}} endDateonChange={(e) => {props.updateFunc(e, props.array, props.setArray, index, 'endDate')}}
                        ongoing={props.array[index].ongoing}
                        onOngoingChange={(val) => {props.updateFunc(val, props.array, props.setArray, index, 'ongoing')}}
                      />}
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
                  {/* Rows scroll past 5 items (.entry-rows caps the height); the Add
                      button stays put below the list. */}
                  {(() => {
                    const rows = props.array.map(item => (
                      <li key={item.id}>
                        {/* Experience/Education rows are labelled by POSITION/DEGREE, not
                            company/school — several roles at one employer made every row read
                            identically. Falls back to the title if no subtitle is set yet. */}
                        {(() => {
                          const summary = (
                            <SummaryComponentDiv
                              onHide={(value) => {
                                const index = props.array.findIndex(subItem => subItem.id === item.id);
                                props.updateFunc(value, props.array, props.setArray, index, 'hidden');
                              }}
                              name={props.swapTitleSubtitle ? (item.subtitle || item.title) : item.title}
                              initial={item.hidden}
                              themeProp={props.themeP}
                              onClick={() => {
                                setShow(true);
                                setIndex(props.array.findIndex(subItem => subItem.id === item.id));
                                setTempEd(item);
                              }}
                            />
                          );
                          return props.reorderable
                            ? <SortableEntryRow id={String(item.id)}>{summary}</SortableEntryRow>
                            : summary;
                        })()}
                      </li>
                    ));
                    return (
                      <div className='entry-rows'>
                        {props.reorderable ? (
                          /* Modifiers pin the drag to the vertical axis AND inside .entry-rows
                             (the first scrollable ancestor) — a row dragged sideways/past the end
                             otherwise grows the list's scroll size and pops both scrollbars
                             mid-drag. NOT restrictToParentElement: dnd-kit measures the dragged
                             row's direct parent, the <li>, which is exactly row-sized and would
                             clamp all movement to zero. */
                          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleEntryDragEnd} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
                            <SortableContext items={props.array.map(item => String(item.id))} strategy={verticalListSortingStrategy}>
                              {rows}
                            </SortableContext>
                          </DndContext>
                        ) : rows}
                      </div>
                    );
                  })()}
                  <AddBtnDiv themeProp={props.themeP} name={props.name} onClick={addBtnReplacement}/>
                </div>
              )}
            </AnimatedHeight>
        </InputBlock>
    )
}

export default BigComponent;
