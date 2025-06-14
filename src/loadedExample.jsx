import { useState } from 'react';
import LeftColumn from './edit-components/Left-column';
import StickyDiv from './edit-components/StickyDivComponent';
import PersonInfoDiv from './resume-component/PersonInfo';
import GeneralInfoBox from './resume-component/General-Info-Block';
import SkillResumeDiv from './resume-component/SkillsLangResumeDiv';
import BigComponent from './edit-components/AttemptComponent';
import CutomizeComponentDiv from './edit-components/CustomizeComponent';

import EducationSvg from './components/Education';
import SkillsSvg from './components/Skills';
import ExperienceSvg from './components/Experience';
import PersonalProjectsSvg from './components/PersonalProjects';

function LoadedExample() {
  const [secondTab, setSecondTab] = useState(false);
  const [personalDetailsArray, setPersonalDetailsArray] = useState([{
    id: '',
    hidden: false,
    newValue: true,
    fullname: '',
    email: '',
    phoneNumber: '',
    address: ''
  }]);
  const [educationArray, setEducationArray] = useState([]);
  const [experienceArray, setExperienceArray] = useState([]);
  const [projectArray, setProjectArray] = useState([]);
  const [skillArray, setSkillArray] = useState([{
    id: '',
    hidden: false,
    newValue: true,
    title: '',
    skillList: [],
    languageList: []
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
      placeholder: 'Maelle Desandre',
      importantClass: null,
      subtext: null
    },
    {
      type: 'InputField',
      result: 'email',
      editTitle: 'Email',
      placeholder: 'maelle.desandre@mail.co.fr',
      importantClass: null,
      subtext: null
    },
    {
      type: 'InputField',
      result: 'phoneNumber',
      editTitle: 'Phone Number',
      placeholder: '+33 7807 63 733',
      importantClass: null,
      subtext: null
    },
    {
      type: 'InputField',
      result: 'address',
      editTitle: 'Address',
      placeholder: 'paris, France',
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

  let educationRequirements =
    [
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

  return (
    <>
      <LeftColumn setTab={setSecondTab} />
      <div className='middle-column'>
        <div className='edit-and-load-div'>
          <StickyDiv  />
          { secondTab && <> <CutomizeComponentDiv setTextColor={checkBrightness} styleItself={style} changeStyle={setStyle} /> </> }
          {!secondTab &&
            <>
              { /* Personal details */ }
              <BigComponent 
                name='Personal Details' 
                array={personalDetailsArray} 
                setArray={setPersonalDetailsArray} 
                updateFunc={updateObject} 
                requirementsArray={personalDetailsRequirements} 
                singleObject = {true}
              />

              { /* Education */ }
              <BigComponent 
                name='Education' 
                array={educationArray} 
                setArray={setEducationArray} 
                icon={<EducationSvg />} 
                updateFunc={updateObject} 
                requirementsArray={educationRequirements} 
                addBtnObject={educationObject}
              />

              { /* Skills & Languages */ }
              <BigComponent 
                name='Skills & Language' 
                array={skillArray} 
                setArray={setSkillArray} 
                icon={<SkillsSvg />} 
                updateFunc={updateObject} 
                requirementsArray={skillRequirements} 
                singleObject = {true}
              /> 

              { /* Experience */ }
              <BigComponent 
                name='Experience' 
                array={experienceArray} 
                setArray={setExperienceArray} 
                icon={<ExperienceSvg />} 
                updateFunc={updateObject} 
                requirementsArray={experienceRequirements} 
                addBtnObject={experienceObject}
              />

              { /* Personal Projects */ }
              <BigComponent 
                name='Personal Project' 
                array={projectArray} 
                setArray={setProjectArray} 
                icon={<PersonalProjectsSvg />} 
                updateFunc={updateObject} 
                requirementsArray={personalProjectRequirements} 
                addBtnObject={personalProjectObject}
              />
            </>
          }
        </div> 

        <div className={style.resumeView} style={{padding: style.gridView ? '0' : style.underlined ? '30px' : '0'}}>
          <PersonInfoDiv assertStyle={style} setSvgClr={checkBrightness} child={<SkillResumeDiv assumeStyle={style} setTxtClr={checkBrightnessTab} skillArr={skillArray[0].skillList} langArr={skillArray[0].languageList} />} object={personalDetailsArray[0]} />
          
          <div className={style.resumeInfoParentBoxLeft} style={{padding: style.gridView ? '20px' : style.filledOut ? '30px' : '20px 0'}}>
            { /* Education */ }
            {educationArray.length !== 0 && <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='Education' arr={educationArray} />}
            
            { /* Skills & Languages */ }
            {(!style.gridView && (skillArray[0].skillList.length !== 0 || skillArray[0].languageList.length  !== 0)) && <SkillResumeDiv assumeStyle={style} setTxtClr={checkBrightnessTab} skillArr={skillArray[0].skillList} langArr={skillArray[0].languageList} />}

            { /* Experience */ }
            {experienceArray.length !== 0 && <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='Experience' arr={experienceArray} />}

            { /* Personal Projects */ }
            {projectArray.length !== 0 && <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='Personal Projects' arr={projectArray} />}
            
          </div>
        </div>
      </div>
    </>
  )
}

export default LoadedExample;
