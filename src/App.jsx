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

function App() {
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
    },
    {
      id: -1,
      text: `improved efficiency of washing by 20%`
    }]
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
  }]);
  const [skillArray, setSkillArray] = useState([{
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
      <TopBarDiv onClick={() => {handleDownloadPdf}} />

      <div className='middle-column'>
        <div className="edit-load-div-parent">

          <StickyDiv 
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
              },
              {
                id: -1,
                text: `improved efficiency of washing by 20%`
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

          <LeftColumn setTab={setSecondTab} />

          <div className='edit-and-load-div'>
            { secondTab && <> <CutomizeComponentDiv setTextColor={checkBrightness} styleItself={style} changeStyle={setStyle} /> </> }
            {!secondTab &&
              <>
                <BigComponent 
                  name='Personal Details' 
                  array={personalDetailsArray} 
                  setArray={setPersonalDetailsArray} 
                  updateFunc={updateObject} 
                  requirementsArray={personalDetailsRequirements} 
                  singleObject = {true}
                />

                <BigComponent 
                  name='Education' 
                  array={educationArray} 
                  setArray={setEducationArray} 
                  icon={<EducationSvg />} 
                  updateFunc={updateObject} 
                  requirementsArray={educationRequirements} 
                  addBtnObject={educationObject}
                />

                <BigComponent 
                  name='Skills & Language' 
                  array={skillArray} 
                  setArray={setSkillArray} 
                  icon={<SkillsSvg />} 
                  updateFunc={updateObject} 
                  requirementsArray={skillRequirements} 
                  singleObject = {true}
                /> 

                <BigComponent 
                  name='Experience' 
                  array={experienceArray} 
                  setArray={setExperienceArray} 
                  icon={<ExperienceSvg />} 
                  updateFunc={updateObject} 
                  requirementsArray={experienceRequirements} 
                  addBtnObject={experienceObject}
                />

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
        </div>
        <div ref={printRef} className={style.resumeView}>
          <PersonInfoDiv assertStyle={style} setSvgClr={checkBrightness} child={<SkillResumeDiv assumeStyle={style} setTxtClr={checkBrightnessTab} skillArr={skillArray[0].skillList} langArr={skillArray[0].languageList} />} object={personalDetailsArray[0]} />
          <div className={style.resumeInfoParentBoxLeft} style={{
            padding: style.underlined ? (style.gridView ? '0 10px' : '0 25px 25px 25px') : '30px',
            gap: style.underlined ? '5px' : '20px'
            }}>

            {educationArray.length !== 0 && <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='EDUCATION' arr={educationArray} />}
            {style.personalInfoBox === 'personal-info-box-no-side-padding' && < hr style={{width: '100%'}} />}
            {(!style.gridView && (skillArray[0].skillList.length !== 0 || skillArray[0].languageList.length  !== 0)) && <SkillResumeDiv assumeStyle={style} setTxtClr={checkBrightnessTab} skillArr={skillArray[0].skillList} langArr={skillArray[0].languageList} />}
            {style.underlined && < hr style={{width: '100%'}} />}
            {experienceArray.length !== 0 && <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='EXPERIENCE' arr={experienceArray} />}
            {style.underlined && < hr style={{width: '100%'}} />}
            {projectArray.length !== 0 && <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='PERSONAL PROJECTS' arr={projectArray} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default App;
