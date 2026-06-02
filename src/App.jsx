import { useState } from 'react';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LeftColumn from './edit-components/Left-column';
import StickyDiv from './edit-components/StickyDivComponent';
import BigComponent from './edit-components/AttemptComponent';
import CutomizeComponentDiv from './edit-components/CustomizeComponent';
import PersonInfoDiv from './resume-component/PersonInfo';
import GeneralInfoBox from './resume-component/General-Info-Block';
import SkillResumeDiv from './resume-component/SkillsLangResumeDiv';

import EducationSvg from './components/Education';
import SkillsSvg from './components/Skills';
import ExperienceSvg from './components/Experience';
import PersonalProjectsSvg from './components/PersonalProjects';
import TopBarDiv from './edit-components/TopBar';

import { DndContext, closestCenter, PointerSensor, KeyboardSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SortableSection from './edit-components/SortableSection';

function App() {
  const [theme, setTheme] = useState(false);
  const [secondTab, setSecondTab] = useState(false);
  const [personalDetailsArray, setPersonalDetailsArray] = useState([{
    id: '',
    hidden: false,
    newValue: false,
    fullname: 'Clea Desandre',
    email: 'clea.desandre@gmail.co.fr',
    phoneNumber: '33 7807 63 733',
    address: 'Paris, France'
  }]);
  const [educationArray, setEducationArray] = useState([{
    id: -1,
    hidden: false,
    newValue: false,
    title: 'University of Painters', 
    subtitle: 'Bachelor in Arts',  
    subtext: 'Paris, France',  
    startDate: '09/2017',
    endDate: '06/2021',
    description: [{
      id: -2,
      text: `painted and showcased 'El la vouivre'`
    }
    // ,
    // {
    //   id: -2,
    //   text: `improved efficiency of washing by 20%`
    // }
    ]
  }]);
  const [experienceArray, setExperienceArray] = useState([{
    id: -2,
    hidden: false,
    newValue: false,
    title: 'Musée Bourdelle', 
    subtitle: 'painter assistent',  
    subtext: 'Paris, France',
    startDate: '04/2021',
    endDate: '05/2022',
    description: [{
      id: -2,
      text: `suggested application tecniques and gave inspiration based on historic examples`
    }]
  },
  {
    id: -1,
    hidden: false,
    newValue: false,
    title: 'Perrotin', 
    subtitle: 'guide',  
    subtext: 'Paris, France',
    startDate: '07/2021',
    endDate: '11/2021',
    description: [{
      id: -2,
      text: `expressed delicate summaries of each art piece to visitors`
    }]
  }]);
  const [projectArray, setProjectArray] = useState([{
    id: -1,
    hidden: false,
    newValue: false,
    title: 'El la vouivre',
    subtitle: 'Creator', 
    startDate: '08/2019',
    endDate: '02/2020',
    links: [{
      id: -2,
      text: `wwww.youngArtistsPaintings.fr`
    }],
    description: [{
      id: -2,
      text: `preacticed the acrylic tecnique mixed with oil on canvas`
    }]
  }]);
  const [skillArray, setSkillArray] = useState([{
    id: -1,
    hidden: false,
    newValue: true,
    title: '',
    skillList: [{
      id: -2,
      text: 'painting'
    }],
    languageList: [{
      id: -2,
      text: `French (native)`
    }]
  }]);

  let educationObject = {
    id: '',
    hidden: false,
    newValue: true,
    title: '', 
    subtitle: '',  
    subtext: '',  
    startDate: '',
    endDate: '',
    description: []
  };

  let personalDetailsRequirements = [
    {
      type: 'InputField',
      result: 'fullname',
      editTitle: 'Full Name',
      placeholder: '',
      importantClass: null,
      subtext: null
    },
    {
      type: 'InputField',
      result: 'email',
      editTitle: 'Email',
      placeholder: '',
      importantClass: null,
      subtext: null
    },
    {
      type: 'InputField',
      result: 'phoneNumber',
      editTitle: 'Phone Number',
      placeholder: '',
      importantClass: null,
      subtext: null
    },
    {
      type: 'InputField',
      result: 'address',
      editTitle: 'Address',
      placeholder: '',
      importantClass: null,
      subtext: null
    }
  ]

  let experienceObject = {
    id: '',
    hidden: false,
    newValue: true,
    title: '', 
    subtitle: '',  
    subtext: '',
    startDate: '',
    endDate: '',
    description: []
  };

  let personalProjectObject = {
    id: '',
    hidden: false,
    newValue: true,
    title: '',
    subtitle: '', 
    startDate: '',
    endDate: '',
    links: [],
    description: []
  };

  let educationRequirements = [
    {
      type: 'InputField',
      result: 'title',
      editTitle: 'School / University / Course',
      placeholder: 'University of Arts',
      importantClass: null,
      subtext: null
    },
    {
      type: 'InputField',
      result: 'subtitle',
      editTitle: 'Degree',
      placeholder: 'Bachelor of Science',
      importantClass: null,
      subtext: 'recommended'
    },
    {
      type: 'Dates'
    },
    {
      type: 'InputField',
      result: 'subtext',
      editTitle: 'Location',
      placeholder: 'New York City, US',
      importantClass: null,
      subtext: 'type \'Online\' if no location',
    },
    {
      type: 'Description',
      result: 'description'
    },
  ];

  let skillRequirements = [
    {
      type: 'Description',
      descType: 'skill',
      result: 'skillList',
      editTitle: 'Technical Skills',
      placeholder: 'C++, Excel, Figma, Qt, React JS',
      subtext: null
    },
    {
      type: 'Description',
      descType: 'skill',
      result: 'languageList',
      editTitle: 'Languages',
      placeholder: 'Spanish (native), English(fluent), French(beginner)',
      subtext: null
    }
  ]

  let experienceRequirements =
  [
    {
      type: 'InputField',
      result: 'title',
      editTitle: 'Company',
      placeholder: 'Local candymaker co.',
      importantClass: null,
      subtext: 'optional'
    },
    {
      type: 'InputField',
      result: 'subtitle',
      editTitle: 'Position Title',
      placeholder: 'Freelancer',
      importantClass: null,
      subtext: null
    },
    {
      type: 'Dates'
    },
    {
      type: 'InputField',
      result: 'subtext',
      editTitle: 'Location',
      placeholder: 'New York City, US',
      importantClass: null,
      subtext: 'type \'Online\' if no location',
    },
    {
      type: 'Description',
      result: 'description'
    },
  ];

  let personalProjectRequirements =
  [
    {
      type: 'InputField',
      result: 'title',
      editTitle: 'Project Title',
      placeholder: 'Kitty Destroyer',
      importantClass: null,
      subtext: null,
    },
    {
      type: 'InputField',
      result: 'subtitle',
      editTitle: 'What is it?',
      placeholder: 'Online music streaming service',
      importantClass: 'important-text',
      subtext: '*recommended to describe using maximum 5 core words'
    },
    {
      type: 'Dates'
    },
    {
      type: 'Description',
      result: 'links',
      editTitle: 'Links to the Project', 
      placeholder: 'www.projectwebsite.com',
      subtext: '*recommended style of two links'
    },
    {
      type: 'Description',
      result: 'description',
    },
  ];

  // Data-driven résumé section order (drives both the left editor panel and the
  // rendered résumé). Personal Details / name is pinned at the top and is NOT here.
  // Default chosen by the user: Projects → Experience → Skills → Education.
  const [sectionOrder, setSectionOrder] = useState(['project', 'experience', 'skill', 'education']);
  // When on, the left panel enters "reorder mode": sections show a drag handle and can
  // be dragged to reorder instead of being clicked to edit. See SortableSection.
  const [reorderMode, setReorderMode] = useState(false);

  // dnd-kit sensors: pointer (mouse/pen), touch (phones) and keyboard (accessibility).
  // The small activation distance/delay stops an accidental tap from registering as a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleSectionDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSectionOrder((order) => {
      const oldIndex = order.indexOf(active.id);
      const newIndex = order.indexOf(over.id);
      return arrayMove(order, oldIndex, newIndex);
    });
  }

  const [style, setStyle]= useState({
    gridView: false,
    resumeView: 'resume-view-top',
    personalInfoBox: 'personal-info-box-no-side-padding',
    personalInfoDetail: 'personal-info-details-row',
    resumeInfoParentBoxLeft: 'resume-info-parent-box-left',
    color: '#607480',
    font: `Roboto`,
    filledOut: true,
    underlined: false
  });

  function updateObject (value, array, func, index, property) {
    func(array.map(item => {
      if(item.id === array[index].id) {
        let tempObj = {...item}
        tempObj[property] = value
        return tempObj;
      } else return item;
    }));
  };

  function checkBrightness(hex){
    let temp = [parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16)];
    const brightness = Math.round(((parseInt(temp[0]) * 299) +   (parseInt(temp[1]) * 587) + (parseInt(temp[2]) * 114)) / 1000)
    if(brightness < 140){
        return "rgb(255,255,255)";
    } else return "rgb(0,0,0)";
  };

  function checkBrightnessTab(hex){
    let temp = [parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16)];
    const brightness = Math.round(((parseInt(temp[0]) * 299) +   (parseInt(temp[1]) * 587) + (parseInt(temp[2]) * 114)) / 1000)
    if(brightness < 140){
        return "#eef1f3";
    } else return "rgb(0,0,0)";
  };

  const printRef = useRef(null);
  
  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
    });

    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: 'portrait',
      format: 'a4',
      unit: 'px',
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    console.log('pdf width: ' + pdfWidth);
    console.log('pdf height: ' + pdfHeight);

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`resume.pdf`);
  };

  return (
    <>
      <TopBarDiv onClick={handleDownloadPdf} themeProp = {theme} setThemeProp = {setTheme} />

      <div className={theme ? 'app-body theme-dark' : 'app-body theme-light'} style={{
        backgroundColor: !theme ? 'rgba(243,244,246,255)' : '#252432',
        paddingTop: '2rem',
        display: 'flex'
        }}>
        <div className='middle-column'>
          <div className="edit-load-div-parent">

            <StickyDiv themeProp = {theme}
              emptyPersonalDetails={() => {setPersonalDetailsArray([{
                id: '',
                hidden: false,
                newValue: true,
                fullname: '',
                email: '',
                phoneNumber: '',
                address: ''
              }])}} 
              emptyEducation={() => {setEducationArray([])}} 
              emptyExperience={() => {setExperienceArray([])}} 
              emptySkills={() => {setSkillArray([{
                id: '',
                hidden: false,
                newValue: true,
                title: '',
                skillList: [],
                languageList: []
              }])}} 
              emptyPProject={() => {setProjectArray([])}}  

              fillPersonalDetails={() => {
                setPersonalDetailsArray([{
                  id: 0,
                  hidden: false,
                  newValue: true,
                  fullname: 'Clea Desandre',
                  email: 'clea.desandre@gmail.co.fr',
                  phoneNumber: '33 7807 63 733',
                  address: 'Paris, France'
                }])
              }}
              fillEducation={() => { setEducationArray([{
                id: -2,
                hidden: false,
                newValue: false,
                title: 'University of Painters', 
                subtitle: 'Bachelor in Arts',  
                subtext: 'Paris, France',  
                startDate: '09/2017',
                endDate: '06/2021',
                description: [{
                  id: -2,
                  text: `painted and showcased 'El la vouivre'`
                }]
              }])}} 
              fillExperience={() => { setExperienceArray([{
                id: -2,
                hidden: false,
                newValue: false,
                title: 'Musée Bourdelle', 
                subtitle: 'painter assistent',  
                subtext: 'Paris, France',
                startDate: '04/2021',
                endDate: '05/2022',
                description: [{
                  id: -2,
                  text: `suggested application tecniques and gave inspiration based on historic examples`
                },
                {
                  id: -1,
                  text: `helped with paint mixture, surface preparaiton and scaffolding`
                }]
              },
              {
                id: -1,
                hidden: false,
                newValue: false,
                title: 'Perrotin', 
                subtitle: 'guide',  
                subtext: 'Paris, France',
                startDate: '07/2021',
                endDate: '11/2021',
                description: [{
                  id: -2,
                  text: `expressed delicate summaries of each art piece to visitors`
                },
                {
                  id: -1,
                  text: `helped organize art pieces in a specific way`
                }]
              }])}}
              fillSkills={() => { setSkillArray([{
                id: -1,
                hidden: false,
                newValue: true,
                title: '',
                skillList: [{
                  id: -3,
                  text: 'painting'
                },
                {
                  id: -2,
                  text: 'art guide'
                },
                {
                  id: -1,
                  text: 'color selection and mixing'
                }],
                languageList: [{
                  id: -2,
                  text: `French (native)`
                },
                {
                  id: -1,
                  text: `English (fluent)`
                }]
              }])}}
              fillProject={() => { setProjectArray([{
                id: -1,
                hidden: false,
                newValue: false,
                title: 'El la vouivre',
                subtitle: 'Creator', 
                startDate: '08/2019',
                endDate: '02/2020',
                links: [{
                  id: -1,
                  text: `wwww.youngArtistsPaintings.fr`
                }],
                description: [{
                  id: -2,
                  text: `preacticed the acrylic tecnique mixed with oil on canvas`
                },
                {
                  id: -1,
                  text: `did an extensive research on the inspiration for the painting, Paul Cézanne`
                }]
              }])}}
            />

            <LeftColumn secondTabProp={secondTab} setTab={setSecondTab} themeProp = {theme} />

            <div className='edit-and-load-div'>
              { secondTab && <> <CutomizeComponentDiv themeProp={theme} setTextColor={checkBrightness} styleItself={style} changeStyle={setStyle} /> </> }
              {!secondTab &&
                <>
                  {/* Config for each reorderable content section, keyed by its sectionOrder id. */}
                  {(() => {
                    const sectionConfig = {
                      education: (
                        <BigComponent
                          themeP={theme}
                          name='Education'
                          array={educationArray}
                          setArray={setEducationArray}
                          icon={<EducationSvg />}
                          updateFunc={updateObject}
                          requirementsArray={educationRequirements}
                          addBtnObject={educationObject}
                        />
                      ),
                      skill: (
                        <BigComponent
                          themeP={theme}
                          name='Skills & Language'
                          array={skillArray}
                          setArray={setSkillArray}
                          icon={<SkillsSvg />}
                          updateFunc={updateObject}
                          requirementsArray={skillRequirements}
                          singleObject={true}
                        />
                      ),
                      experience: (
                        <BigComponent
                          themeP={theme}
                          name='Experience'
                          array={experienceArray}
                          setArray={setExperienceArray}
                          icon={<ExperienceSvg />}
                          updateFunc={updateObject}
                          requirementsArray={experienceRequirements}
                          addBtnObject={experienceObject}
                        />
                      ),
                      project: (
                        <BigComponent
                          themeP={theme}
                          name='Personal Project'
                          array={projectArray}
                          setArray={setProjectArray}
                          icon={<PersonalProjectsSvg />}
                          updateFunc={updateObject}
                          requirementsArray={personalProjectRequirements}
                          addBtnObject={personalProjectObject}
                        />
                      ),
                    };

                    return (
                      <>
                        {/* Personal Details is pinned at the top and never reorderable. */}
                        <BigComponent
                          themeP={theme}
                          name='Personal Details'
                          array={personalDetailsArray}
                          setArray={setPersonalDetailsArray}
                          updateFunc={updateObject}
                          requirementsArray={personalDetailsRequirements}
                          singleObject={true}
                        />

                        {/* Toggle: start/stop reorder mode for the content sections.
                            Styled like the Content/Customize + Clear/Load buttons: white
                            when off ("not in use"), shaded when on ("in use"). */}
                        <div className='reorder-toggle-wrapper' style={{ backgroundColor: !theme ? '#fff' : '#3c3a58ff' }}>
                          <button
                            type='button'
                            className='reorder-toggle-btn'
                            aria-pressed={reorderMode}
                            onClick={() => setReorderMode(v => !v)}
                            style={{
                              backgroundColor: !theme
                                ? (reorderMode ? '#eef1f3' : '#fff')
                                : (reorderMode ? '#504d75ff' : '#3c3a58ff'),
                              color: !theme ? '#252432' : '#eef1f3',
                            }}
                          >
                            <h3 style={{ fontWeight: 'bold' }}>
                              {reorderMode ? 'Done reordering' : 'Reorder sections'}
                            </h3>
                          </button>
                        </div>

                        {reorderMode ? (
                          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd}>
                            <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                              {sectionOrder.map(id => (
                                <SortableSection key={id} id={id}>
                                  {sectionConfig[id]}
                                </SortableSection>
                              ))}
                            </SortableContext>
                          </DndContext>
                        ) : (
                          sectionOrder.map(id => (
                            <div key={id}>{sectionConfig[id]}</div>
                          ))
                        )}
                      </>
                    );
                  })()}
                </>
              }
            </div> 
          </div>
          <div ref={printRef} className={style.resumeView}>
            <PersonInfoDiv assertStyle={style} setSvgClr={checkBrightness} child={<SkillResumeDiv assumeStyle={style} setTxtClr={checkBrightnessTab} skillArr={skillArray[0].skillList} langArr={skillArray[0].languageList} />} object={personalDetailsArray[0]} />
            <div className={style.resumeInfoParentBoxLeft} style={{
              padding: style.underlined ? (style.gridView ? '20px' : '0 25px 25px 25px') : '30px',
              gap: style.underlined ? '5px' : '20px'
            }}>

              {/* Sections render in the order defined by `sectionOrder` (item #1 / drag-and-drop foundation). */}
              {(() => {
                // Build each section's node (or null if it has no content / is hidden in this view).
                const sectionNode = (key) => {
                  switch (key) {
                    case 'education':
                      return educationArray.length !== 0
                        ? <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='EDUCATION' arr={educationArray} />
                        : null;
                    case 'skill':
                      // In gridView the skills box lives in the personal-info column instead.
                      return (!style.gridView && (skillArray[0].skillList.length !== 0 || skillArray[0].languageList.length !== 0))
                        ? <SkillResumeDiv assumeStyle={style} setTxtClr={checkBrightnessTab} skillArr={skillArray[0].skillList} langArr={skillArray[0].languageList} />
                        : null;
                    case 'experience':
                      return experienceArray.length !== 0
                        ? <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='EXPERIENCE' arr={experienceArray} />
                        : null;
                    case 'project':
                      return projectArray.length !== 0
                        ? <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='PERSONAL PROJECTS' arr={projectArray} />
                        : null;
                    default:
                      return null;
                  }
                };

                // Only render sections that have content, then interleave the optional
                // underline separators between consecutive visible sections.
                const visible = sectionOrder
                  .map(key => ({ key, node: sectionNode(key) }))
                  .filter(s => s.node !== null);

                return visible.map((s, i) => (
                  <div key={s.key} style={{ display: 'contents' }}>
                    {s.node}
                    {style.underlined && i < visible.length - 1 && <hr style={{ width: '100%' }} />}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
