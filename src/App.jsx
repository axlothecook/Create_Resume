import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import ResumePdfDocument from './pdf/ResumePdfDocument';
import AuthScreen from './auth/AuthScreen';
import { api } from './api/client';
import SavedDocsRail from './edit-components/SavedDocsRail';
import FloatingActions from './edit-components/FloatingActions';
import NameModal from './edit-components/NameModal';
import ConfirmModal from './edit-components/ConfirmModal';
import Toasts from './edit-components/Toasts';
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

import { DndContext, closestCenter, PointerSensor, KeyboardSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SortableSection from './edit-components/SortableSection';

function App() {
  const [theme, setTheme] = useState(false);
  // Auth: 'loading' until /auth/me resolves, then the editor or the AuthScreen shows.
  // user = the logged-in account (or null); isGuest = chose "Browse as guest".
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading' | 'out' | 'in'
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Saved-docs (#6): the account's saved résumés (lightweight {id,title,...}), the
  // currently-loaded doc's id (null = unsaved/new), and a busy flag to block actions
  // mid-request. Only ever populated for logged-in (non-guest) users.
  const [savedDocs, setSavedDocs] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [docsBusy, setDocsBusy] = useState(false);

  // Name-résumé modal (replaces window.prompt). promptForName() opens it and returns a
  // promise that resolves to the trimmed title, or null if cancelled.
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const nameResolverRef = useRef(null);
  const promptForName = () => new Promise((resolve) => {
    nameResolverRef.current = resolve;
    setNameModalOpen(true);
  });
  const resolveName = (value) => {
    setNameModalOpen(false);
    const resolve = nameResolverRef.current;
    nameResolverRef.current = null;
    if (resolve) resolve(value);
  };

  // Generic confirm modal (Proceed / Cancel). confirm({title, message, ...}) opens it
  // and resolves true on Proceed, false on Cancel. Replaces window.confirm.
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContent, setConfirmContent] = useState({});
  const confirmResolverRef = useRef(null);
  const confirm = (content) => new Promise((resolve) => {
    confirmResolverRef.current = resolve;
    setConfirmContent(content || {});
    setConfirmOpen(true);
  });
  const resolveConfirm = (ok) => {
    setConfirmOpen(false);
    const resolve = confirmResolverRef.current;
    confirmResolverRef.current = null;
    if (resolve) resolve(ok);
  };

  // Toast notifications (top-right). showToast adds one; the Toast component owns its
  // 4s lifecycle + exit animation and calls dismissToast to remove itself.
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);
  const dismissToast = (id) => setToasts((list) => list.filter((t) => t.id !== id));
  const showToast = (type, message) => {
    const id = ++toastIdRef.current;
    setToasts((list) => [...list, { id, type, message }]);
  };

  useEffect(() => {
    api.me()
      .then((res) => {
        if (res.user) { setUser(res.user); setAuthStatus('in'); }
        else setAuthStatus('out');
      })
      .catch(() => setAuthStatus('out')); // backend unreachable → show auth screen
  }, []);

  // Load the saved-résumé list once a real user is in (guests never call this).
  useEffect(() => {
    if (authStatus === 'in' && user && !isGuest) {
      refreshSavedDocs();
    }
  }, [authStatus, user, isGuest]);

  // Load the saved list AND each résumé's full data (so the rail can render a live
  // preview thumbnail per card). Max is 5, so fetching every doc's data is cheap.
  const refreshSavedDocs = async () => {
    try {
      const res = await api.listResumes();
      const list = res.resumes || [];
      const withData = await Promise.all(list.map(async (d) => {
        try {
          const full = await api.getResume(d.id);
          return { ...d, data: full.resume.data };
        } catch {
          return { ...d, data: null };
        }
      }));
      setSavedDocs(withData);
    } catch {
      /* leave the list empty if it fails; rail still works */
    }
  };

  const handleLogout = () => {
    // Switch to the auth screen immediately — don't block the UI on the network.
    const wasGuest = isGuest;
    setUser(null);
    setIsGuest(false);
    setAuthStatus('out');
    setSavedDocs([]);
    setCurrentDocId(null);
    // Guests have no server session, so skip the request entirely. For real users,
    // destroy the session in the background (we already left the editor).
    if (!wasGuest) api.logout().catch(() => { /* ignore */ });
  };

  const [secondTab, setSecondTab] = useState(false);
  // Remount key for the editor column. The editor's inputs are UNCONTROLLED
  // (defaultValue), so replacing the state arrays (loading a saved CV, Clear Resume,
  // Load Example) does NOT refresh what the always-mounted forms display — Personal
  // Details kept showing the mount-time filler after a load. Bumping this key
  // remounts the forms so every defaultValue re-reads the fresh state.
  const [editorKey, setEditorKey] = useState(0);
  const bumpEditorKey = () => setEditorKey((k) => k + 1);
  // Which of the Clear-Resume / Load-Example buttons is "selected": whichever was
  // clicked last (default 'load' since the app starts with the example loaded). Drives
  // the selected-highlight on those two buttons.
  const [clearLoadSelection, setClearLoadSelection] = useState('load'); // 'clear' | 'load'
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
      text: `wwww.youngArtistsPaintings.fr`,
      name: `Young Artists Paintings`
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
    portfolioLink: '',    // optional link shown (clickable) next to the Technical Skills title
    portfolioLinkName: '', // the words the portfolio link shows (e.g. 'portfolio website')
    skillHidden: false,   // visibility of the Technical Skills sub-group
    langHidden: false,    // visibility of the Languages sub-group
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
      type: 'InputField',
      result: 'portfolioLink',
      editTitle: 'Portfolio link',
      placeholder: 'www.yourportfolio.com',
      subtext: '*shown as a clickable link next to the Technical Skills title'
    },
    {
      type: 'InputField',
      result: 'portfolioLinkName',
      editTitle: 'Portfolio link label',
      placeholder: 'portfolio website',
      subtext: '*the words the link shows (e.g. portfolio website)'
    },
    {
      type: 'Description',
      descType: 'skill',
      result: 'skillList',
      hideField: 'skillHidden',   // visibility flag toggled by the group's eye
      editTitle: 'Technical Skills',
      placeholder: 'C++, Excel, Figma, Qt, React JS',
      subtext: null
    },
    {
      type: 'Description',
      descType: 'skill',
      result: 'languageList',
      hideField: 'langHidden',
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
      descType: 'link',
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
    underlined: false,
    showCredit: false   // "Made with Resume Creator" footer (off by default)
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

  // --- Saved-docs (#6): gather/hydrate the full editor state ---
  // The backend stores a résumé's `data` as the FULL editor state verbatim, so saving
  // captures everything and loading restores the session exactly.
  const gatherState = () => ({
    personalDetails: personalDetailsArray,
    education: educationArray,
    experience: experienceArray,
    project: projectArray,
    skill: skillArray,
    sectionOrder,
    style,
  });

  const hydrateState = (data) => {
    if (!data) return;
    if (data.personalDetails) setPersonalDetailsArray(data.personalDetails);
    if (data.education) setEducationArray(data.education);
    if (data.experience) setExperienceArray(data.experience);
    if (data.project) setProjectArray(data.project);
    if (data.skill) setSkillArray(data.skill);
    if (data.sectionOrder) setSectionOrder(data.sectionOrder);
    if (data.style) setStyle(data.style);
    bumpEditorKey(); // remount the (uncontrolled) editor forms onto the loaded state
  };

  // --- Unsaved-changes guard (#6) ---
  // Baseline snapshot of the editor at the last save / load (and first mount). The
  // editor is "dirty" when the current state differs from this baseline.
  const savedSnapshotRef = useRef(JSON.stringify(gatherState()));
  const markSaved = () => { savedSnapshotRef.current = JSON.stringify(gatherState()); };
  const hasUnsavedChanges = () => JSON.stringify(gatherState()) !== savedSnapshotRef.current;

  // Reset the editor to a blank résumé (same as "Clear Resume"), drop the loaded doc,
  // and re-baseline so the blank slate isn't immediately "dirty".
  const clearToBlank = () => {
    const blankPersonal = [{ id: '', hidden: false, newValue: true, fullname: '', email: '', phoneNumber: '', address: '' }];
    const blankSkill = [{ id: '', hidden: false, newValue: true, title: '', portfolioLink: '', portfolioLinkName: '', skillHidden: false, langHidden: false, skillList: [], languageList: [] }];
    setPersonalDetailsArray(blankPersonal);
    setEducationArray([]);
    setExperienceArray([]);
    setProjectArray([]);
    setSkillArray(blankSkill);
    setCurrentDocId(null);
    setClearLoadSelection('clear');
    bumpEditorKey(); // remount the (uncontrolled) editor forms onto the blank state
    // Re-baseline to the blank state (built explicitly so it doesn't depend on the
    // async state setters above having flushed).
    savedSnapshotRef.current = JSON.stringify({
      personalDetails: blankPersonal,
      education: [], experience: [], project: [],
      skill: blankSkill, sectionOrder, style,
    });
  };

  const MAX_DOCS = 5;
  const maxReached = savedDocs.length >= MAX_DOCS;

  // "+ Add new": start a fresh blank résumé. If there are unsaved changes, warn first
  // (Proceed discards them); then reset the editor to a clean slate. The user builds the
  // new CV and saves it later via Save. (Industry-standard "New document" behaviour.)
  const handleAddNew = async () => {
    if (docsBusy) return;
    if (hasUnsavedChanges()) {
      const ok = await confirm({
        title: 'Unsaved changes',
        message: 'You have unsaved changes. Starting a new résumé will discard them. Do you want to proceed?',
        proceedLabel: 'Proceed',
        cancelLabel: 'Cancel',
      });
      if (!ok) return;
    }
    clearToBlank();
  };

  // "Save": update the loaded doc (PUT). If nothing is loaded yet, behave like Add new
  // (prompt for a title + POST), respecting the max limit.
  const handleSaveDoc = async () => {
    if (docsBusy) return;
    setDocsBusy(true);
    try {
      if (currentDocId) {
        await api.updateResume(currentDocId, { data: gatherState() });
      } else {
        if (maxReached) {
          showToast('error', `You can save up to ${MAX_DOCS} résumés — delete one to save a new one.`);
          return;
        }
        const title = await promptForName();
        if (!title) return;
        const res = await api.createResume(title, gatherState());
        setCurrentDocId(res.resume.id);
        setClearLoadSelection('load');
      }
      markSaved(); // current state is now the saved baseline
      await refreshSavedDocs();
      showToast('success', 'Résumé saved.');
    } catch (err) {
      // 401 = the session was lost (cookie expired, or the browser is blocking cookies
      // for the site) — the save can't go through. Tell the user plainly and send them
      // back to the login screen to re-authenticate, instead of a cryptic "Not
      // authenticated." toast that leaves them stuck.
      if (err.status === 401) {
        showToast('error', 'Your session has expired or your browser is blocking cookies for this site. Please log in again.');
        handleLogout();
      }
      // A 409 from the server is the max-limit case; everything else is a generic error.
      else if (err.status === 409) showToast('error', err.message || `You can save up to ${MAX_DOCS} résumés — delete one first.`);
      else showToast('error', err.message || 'Could not save the résumé.');
    } finally {
      setDocsBusy(false);
    }
  };

  // Load a saved résumé into the editor (GET full data → hydrate every state slice).
  const handleLoadDoc = async (id) => {
    if (docsBusy) return;
    setDocsBusy(true);
    try {
      const res = await api.getResume(id);
      const data = res.resume.data;
      hydrateState(data);
      setCurrentDocId(id);
      setClearLoadSelection('load');
      // Baseline to the just-loaded data (built from `data` so it doesn't depend on
      // the async state setters having flushed) — a freshly loaded CV isn't "dirty".
      savedSnapshotRef.current = JSON.stringify({
        personalDetails: data.personalDetails,
        education: data.education,
        experience: data.experience,
        project: data.project,
        skill: data.skill,
        sectionOrder: data.sectionOrder,
        style: data.style,
      });
    } catch (err) {
      showToast('error', err.message || 'Could not load the résumé.');
    } finally {
      setDocsBusy(false);
    }
  };

  const handleDeleteDoc = async (id, title) => {
    if (docsBusy) return;
    const ok = await confirm({
      title: 'Delete résumé',
      message: `Delete "${title}"? This can't be undone.`,
      proceedLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
    if (!ok) return;
    setDocsBusy(true);
    try {
      await api.deleteResume(id);
      setSavedDocs((list) => list.filter((d) => d.id !== id));
      if (currentDocId === id) setCurrentDocId(null);
      showToast('success', 'Résumé deleted.');
    } catch (err) {
      showToast('error', err.message || 'Could not delete the résumé.');
    } finally {
      setDocsBusy(false);
    }
  };

  // One-click vector PDF download via @react-pdf/renderer. Builds the ordered
  // sections from the same state that drives the on-screen résumé.
  const handleDownloadPdf = async () => {
    const sectionData = {
      education: { key: 'education', label: 'EDUCATION', items: educationArray },
      experience: { key: 'experience', label: 'EXPERIENCE', items: experienceArray },
      project: { key: 'project', label: 'PERSONAL PROJECTS', items: projectArray },
      skill: { key: 'skill', label: 'SKILLS & LANGUAGES' },
    };
    // Skills sub-groups respect their visibility flags (a hidden group is omitted).
    const skill = skillArray[0];
    const pdfSkills = {
      skillList: skill.skillHidden ? [] : skill.skillList,
      languageList: skill.langHidden ? [] : skill.languageList,
    };
    // Drop sections with no visible content (all items hidden, or both skill groups
    // hidden) so the printed PDF matches the on-screen demo.
    const sectionHasContent = (key) => {
      if (key === 'skill') return pdfSkills.skillList.length !== 0 || pdfSkills.languageList.length !== 0;
      const items = sectionData[key].items || [];
      return items.some(item => !item.hidden);
    };
    const orderedSections = sectionOrder
      .map(k => sectionData[k])
      .filter(Boolean)
      .filter(sec => sectionHasContent(sec.key));

    const blob = await pdf(
      <ResumePdfDocument
        personalDetails={personalDetailsArray[0]}
        skills={pdfSkills}
        orderedSections={orderedSections}
        style={style}
      />
    ).toBlob();

    // Filename: logged-in users get "<username>-resume.pdf"; guests get "johndoe-resume.pdf".
    const slug = (user && user.username ? user.username : 'johndoe')
      .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'johndoe';

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-resume.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'PDF downloaded.');
  };

  // While checking the session, render nothing (brief). When logged out and not a
  // guest, show the auth screen. Otherwise show the editor.
  if (authStatus === 'loading') {
    return <div className={theme ? 'app-shell theme-dark' : 'app-shell theme-light'} style={{ minHeight: '100vh', backgroundColor: !theme ? 'rgba(243,244,246,1)' : '#252432' }} />;
  }
  if (authStatus === 'out' && !isGuest) {
    return (
      <AuthScreen
        onAuthenticated={(u) => { setUser(u); setIsGuest(false); setAuthStatus('in'); }}
        onGuest={() => { setIsGuest(true); }}
      />
    );
  }

  return (
    <div className={theme ? 'app-shell theme-dark' : 'app-shell theme-light'} style={{
      backgroundColor: !theme ? 'rgba(243,244,246,255)' : '#252432'
      }}>
      {/* The rail is now the ONLY chrome (the topbar was removed). It renders for
          everyone — guests get PDF + theme + sign-in but no saved-docs actions. */}
      <div className="app-body app-body--with-rail" style={{
        display: 'flex',
        paddingTop: '2rem' // breathing room at the top of the content
        }}>
        <SavedDocsRail
          isGuest={isGuest}
          user={user}
          docs={savedDocs}
          currentDocId={currentDocId}
          busy={docsBusy}
          setSvgClr={checkBrightness}
          setTxtClr={checkBrightnessTab}
          onAddNew={handleAddNew}
          onLoad={handleLoadDoc}
          onDelete={handleDeleteDoc}
          themeProp={theme}
          setThemeProp={setTheme}
          onLogout={handleLogout}
        />
        <div className='middle-column'>
          <div className="edit-load-div-parent">

            <StickyDiv themeProp = {theme}
              selection={clearLoadSelection}
              setSelection={setClearLoadSelection}
              emptyPersonalDetails={() => {
                setPersonalDetailsArray([{
                  id: '',
                  hidden: false,
                  newValue: true,
                  fullname: '',
                  email: '',
                  phoneNumber: '',
                  address: ''
                }]);
                bumpEditorKey(); // Clear Resume: remount forms onto the blank state
              }}
              emptyEducation={() => {setEducationArray([])}} 
              emptyExperience={() => {setExperienceArray([])}} 
              emptySkills={() => {setSkillArray([{
                id: '',
                hidden: false,
                newValue: true,
                title: '',
                portfolioLink: '',
                portfolioLinkName: '',
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
                }]);
                bumpEditorKey(); // Load Example: remount forms onto the example state
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
                  text: `wwww.youngArtistsPaintings.fr`,
                  name: `Young Artists Paintings`
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

            <div className='edit-and-load-div' key={editorKey}>
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

                        {/* Optional "Made with Resume Creator" credit — toggle sits below
                            all sections; shows the credit in the demo + downloaded PDF. */}
                        {!reorderMode && (
                          <div className='reorder-toggle-wrapper' style={{ backgroundColor: !theme ? '#fff' : '#3c3a58ff' }}>
                            <button
                              type='button'
                              className='reorder-toggle-btn'
                              aria-pressed={style.showCredit}
                              onClick={() => setStyle(s => ({ ...s, showCredit: !s.showCredit }))}
                              style={{
                                backgroundColor: !theme
                                  ? (style.showCredit ? '#eef1f3' : '#fff')
                                  : (style.showCredit ? '#504d75ff' : '#3c3a58ff'),
                                color: !theme ? '#252432' : '#eef1f3',
                              }}
                            >
                              <h3 style={{ fontWeight: 'bold' }}>
                                {style.showCredit ? 'Hide credit' : 'Show credit'}
                              </h3>
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </>
              }
            </div>
          </div>
          {/* Wrapper lets the A4 page scale down to fit narrow (mobile) widths without
              overflowing — the inner .resume-view-* keeps its true 210mm size + ref so
              the PDF/print render is unaffected; CSS transform shrinks it on phones. */}
          <div className='resume-demo-wrap'>
          <div ref={printRef} className={style.resumeView}>
            <PersonInfoDiv assertStyle={style} setSvgClr={checkBrightness} object={personalDetailsArray[0]} />
            <div className={style.resumeInfoParentBoxLeft} style={{
              padding: style.underlined ? (style.gridView ? '20px' : '0 25px 25px 25px') : '30px',
              gap: style.underlined ? '5px' : '20px'
            }}>

              {/* Sections render in the order defined by `sectionOrder` (item #1 / drag-and-drop foundation). */}
              {(() => {
                // Build each section's node (or null if it has no content / is hidden in this view).
                // A section renders only if it has at least one VISIBLE (non-hidden)
                // item — so toggling every item's eye off removes the whole section
                // (title included) from the demo + PDF.
                const sectionNode = (key) => {
                  switch (key) {
                    case 'education':
                      return educationArray.some(item => !item.hidden)
                        ? <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='EDUCATION' arr={educationArray} />
                        : null;
                    case 'skill': {
                      // Skills & Languages renders in the main content column (every
                      // layout). It hides only when BOTH sub-groups (skills + languages)
                      // are toggled off (skillHidden + langHidden).
                      const s = skillArray[0];
                      const skillsVisible = s.skillList.length !== 0 && !s.skillHidden;
                      const langVisible = s.languageList.length !== 0 && !s.langHidden;
                      return (skillsVisible || langVisible)
                        ? <SkillResumeDiv assumeStyle={style} setTxtClr={checkBrightnessTab} skillArr={skillsVisible ? s.skillList : []} langArr={langVisible ? s.languageList : []} portfolioLink={s.portfolioLink} portfolioLinkName={s.portfolioLinkName} />
                        : null;
                    }
                    case 'experience':
                      return experienceArray.some(item => !item.hidden)
                        ? <GeneralInfoBox assumeStyle={style} setTxtClr={checkBrightnessTab} resumeTitle='EXPERIENCE' arr={experienceArray} />
                        : null;
                    case 'project':
                      return projectArray.some(item => !item.hidden)
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
            {/* Optional credit footer at the bottom of the résumé (demo + PDF). */}
            {style.showCredit && (
              <p className='resume-credit'>
                Made with{' '}
                <a href='https://github.com/axlothecook/Create_Resume' target='_blank' rel='noopener noreferrer'>Resume Creator</a>
              </p>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Fixed Save + Download buttons, bottom-right (Save is logged-in only). */}
      <FloatingActions
        isGuest={isGuest}
        busy={docsBusy}
        onSave={handleSaveDoc}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Name-résumé modal (replaces window.prompt for Add new / first Save). */}
      <NameModal
        open={nameModalOpen}
        themeProp={theme}
        onSubmit={(title) => resolveName(title)}
        onCancel={() => resolveName(null)}
      />

      {/* Generic confirm modal (unsaved-changes warning, delete confirmation, …). */}
      <ConfirmModal
        open={confirmOpen}
        themeProp={theme}
        title={confirmContent.title}
        message={confirmContent.message}
        proceedLabel={confirmContent.proceedLabel}
        cancelLabel={confirmContent.cancelLabel}
        onProceed={() => resolveConfirm(true)}
        onCancel={() => resolveConfirm(false)}
      />

      {/* Top-right toast notifications (saved / PDF downloaded / errors). */}
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default App;
