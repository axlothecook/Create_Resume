import './resumeEditor.css';
import TrashSvg from '../components/Trash';

const BottomBar = (props) => {
    return (
        <div className='bottom-options-div'>
            <button className='delete-btn' onClick={props.onDelete}>
                <TrashSvg color={'grey'} width={'15px'} height={'15px'} /> 
                <h4>Delete</h4>
            </button>
            <button className='cancel-btn' onClick={props.onCancel}>
                <h4>Cancel</h4>
            </button>
            <button className='save-btn' onClick={props.onSave}>
                <h4>Save</h4>
            </button>
        </div>
    )
};

export default BottomBar;