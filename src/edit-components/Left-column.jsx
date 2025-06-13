import { useState } from 'react';
import './resumeEditor.css';
import DocumentSvg from '../components/Document';
import EditSvg from '../components/Edit';

const LeftColumn = (props) => {
  const [tracker, setTracker] = useState({
    contentBtnClr: '#eef1f3',
    customizeBtnClr: '#fff'
  });
  
    return (
        <div className='left-column'>
        <button className='left-col-box' style={{backgroundColor: tracker.contentBtnClr}} onClick={() => {
          setTracker({
            contentBtnClr: '#eef1f3',
            customizeBtnClr: '#fff'
          });
          props.setTab(false);
        }}>
          <DocumentSvg />
          <h3>Content</h3>
        </button>
        <button className='left-col-box' style={{backgroundColor: tracker.customizeBtnClr}} onClick={() => {
          setTracker({
            contentBtnClr: '#fff',
            customizeBtnClr: '#eef1f3'
          });
          props.setTab(true);
        }}>
          <EditSvg width='20px' height='20px' color='#0e374e' />
          <h3>Customize</h3>
        </button>
      </div>
    )
};

export default LeftColumn;