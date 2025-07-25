import './resumeEditor.css';
import DocumentSvg from '../components/Document';
import EditSvg from '../components/Edit';

const LeftColumn = (props) => {
    return (
      <div 
        className='left-column' 
        style={{backgroundColor: !props.themeProp ? '#fff' : '#3c3a58ff'}}>
        <button 
          className='left-col-box' 
          style={{backgroundColor: !props.themeProp ? (props.secondTabProp ? '#fff' : '#eef1f3') : (props.secondTabProp ? '#3c3a58ff' : '#504d75ff')}}
          onClick={() => {
            props.setTab(false);
        }}>
          <DocumentSvg />
          <h3 style={{fontWeight: 'bold'}}>Content</h3>
        </button>
        <button 
          className='left-col-box' 
          style={{backgroundColor: !props.themeProp ? (props.secondTabProp ? '#eef1f3' : '#fff') : (props.secondTabProp ? '#504d75ff' : '#3c3a58ff')}}
          onClick={() => {
            props.setTab(true);
        }}>
          <EditSvg width='20px' height='20px' color='#0e374e' />
          <h3 style={{fontWeight: 'bold'}}>Customize</h3>
        </button>
      </div>
    )
};

export default LeftColumn;