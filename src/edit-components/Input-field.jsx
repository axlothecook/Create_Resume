import './resumeEditor.css';

const InputField = (props) => {
    return (
        <div className='edit-info-box'>
            <div className={props.subtext ? 'edit-title-box' : 'edit-title-box-no-recommended'}>
                {props.editTitle && <h4>{props.editTitle}</h4>}
                {props.importantClass ? <h4 className={props.importantClass}> {props.subtext} </h4> : props.subtext && <p>{props.subtext} </p>}
            </div>
            <input className='edit-input' type={props.type} placeholder={props.placeholder} onChange={props.onChange} defaultValue={props.initial} />
        </div>
    )
}

export default InputField;