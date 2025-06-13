import './resumeEditor.css';

const LinksDescription = () => {
    return (
        <div className='edit-info-box'>
            <div className='edit-title-box'>
                <h4>Link to the Project</h4>
                <p>github repo link is optional</p>
            </div>
            <input className='edit-input' placeholder='www.coolwebsite.com' />
            <input className='edit-input' placeholder='www.github.com/user' />
        </div>
    )
}

export default LinksDescription;