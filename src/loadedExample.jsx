import { useState } from 'react';
import LeftColumn from './edit-components/Left-column';
import InputBlock from './edit-components/Edit-input-block';
import InputField from './edit-components/Input-field';
import Dates from './edit-components/Dates';
// import Description from './edit-components/Description';
import MultipleSelection from './edit-components/MultipleSelection';
import LinksDescription from './edit-components/LinksContainer';
import StickyDiv from './edit-components/StickyDivComponent';
import PersonInfoDiv from './resume-component/PersonInfo';
import GeneralInfoBox from './resume-component/General-Info-Block';
import SkillResumeDiv from './resume-component/SkillsLangResumeDiv';
import PersonalDetailsDiv from './edit-components/PersonalDetails';
// import AddBtnDiv from './edit-components/AddBtn';
// import BottomBar from './edit-components/BottomBar';
// import SummaryComponentDiv from './edit-components/ArraySummary';
import BigComponent from './edit-components/AttemptComponent';
import CutomizeComponentDiv from './edit-components/CustomizeComponent';

import EducationSvg from './components/Education';
import SkillsSvg from './components/Skills';
import ExperienceSvg from './components/Experience';
import PersonalProjectsSvg from './components/PersonalProjects';

function LoadedExample() {
  const [secondTab, setSecondTab] = useState(false);
  const [educationArray, setEducationArray] = useState([]);
  const [experienceArray, setExperienceArray] = useState([]);
  const [projectArray, setProjectArray] = useState([]);
  const [skillArray, setSkillArray] = useState([]);
  const [tempEd, setTempEd] = useState({});

  let educationObject = {
    id: '',
    hidden: false,
    newValue: true,
    source: '',
    degree: '',
    location: '',
    startDate: '',
    endDate: '',
    description: []
  };

  let experienceObject = {
    id: '',
    hidden: false,
    newValue: true,
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    description: []
  };

  let personalProjectObject = {
    id: '',
    hidden: false,
    newValue: true,
    title: '',
    summary: '',
    startDate: '',
    endDate: '',
    links: [],
    description: []
  };

  let educationRequirements =
    [
      {
        type: 'InputField',
        result: 'source',
        editTitle: 'School / University / Course',
        placeholder: 'University of Arts',
        importantClass: null,
        subtext: null
      },
      {
        type: 'InputField',
        result: 'degree',
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
        result: 'location',
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

    let experienceRequirements =
    [
      {
        type: 'InputField',
        result: 'company',
        editTitle: 'Company',
        placeholder: 'Local candymaker co.',
        importantClass: null,
        subtext: 'optional'
      },
      {
        type: 'InputField',
        result: 'position',
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
        result: 'location',
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
        result: 'summary',
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
        editTitle: 'Link to the Project', //pass the name to the prop so it's name is not desc but links to the project,
        placeholder: 'www.projectwebsite.com',
        subtext: '*recommended style of two links'
      },
      {
        type: 'Description',
        result: 'description'
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

  const [PersonalDetails, setPersonalDetails] = useState({
    fullname: 'Maelle Desandre',
    email: 'maelle.desandre@yahoo.co',
    phoneNumber: '44 3245 5521 5521',
    address: 'Lumiere, Canvas'
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
              <PersonalDetailsDiv>
                <div className='block-wrapper'>
                  <InputField onChange={(e) => {setPersonalDetails({...PersonalDetails, fullname: e.target.value})}} editTitle='Full Name' importantClass={null} subtext={null} type='text' placeholder='Josephine Meyers'/>
                  <InputField onChange={(e) => {setPersonalDetails({...PersonalDetails, email: e.target.value})}} editTitle='Email' importantClass={null} subtext={'recommended'} type='email' placeholder='josephine.meyers@mail.co.uk'/>
                  <InputField onChange={(e) => {setPersonalDetails({...PersonalDetails, phoneNumber: e.target.value})}} editTitle='Phone Number' importantClass={null} subtext={'recommended'} type='number' placeholder='+44 3245 5521 5521'/>
                  <InputField onChange={(e) => {setPersonalDetails({...PersonalDetails, address: e.target.value})}} editTitle='Address' importantClass={null} subtext={'recommended'} type='address' placeholder='London, UK'/>
                </div>
              </PersonalDetailsDiv>

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
              <InputBlock name='Skills & Languages' icon={ <SkillsSvg /> } >
                <MultipleSelection editTitle='List Technical Skills:' importantClass={null} type='text' placeholder='Enter a technical skill' />
                <MultipleSelection editTitle='List Speaking Languages:' importantClass={null} type='text' placeholder='Spanish (native), English (fluent)' />
                {/* <BottomBar /> */}
              </InputBlock>

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

        <div className={style.resumeView}>
          <PersonInfoDiv assertStyle={style} setSvgClr={checkBrightness} child={<SkillResumeDiv assumeStyle={style} setTxtClr={checkBrightnessTab} skillArr='C, C++, VHDL, PowerPoint, Excel, React Native' langArr='English (fluent), Arabic (native), Dutch (superficial)' />} personFullName={PersonalDetails.fullname} personEmail={PersonalDetails.email} personPhone={PersonalDetails.phoneNumber} personLocation={PersonalDetails.address} />
          
          <div className={style.resumeInfoParentBoxLeft} style={{padding: (style.gridView ? '20px' : '20px 0')}}>
            { /* Education */ }
            {educationArray.length !== 0 && <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='Education' arr={educationArray} />}
            
            { /* Skills & Languages */ }
            {!style.gridView && <SkillResumeDiv assumeStyle={style} setTxtClr={checkBrightnessTab} skillArr='C, C++, VHDL, PowerPoint, Excel, React Native' langArr='English (fluent), Arabic (native), Dutch (superficial)' />}

            
          </div>
        </div>
      </div>
    </>
  )
}

export default LoadedExample;
