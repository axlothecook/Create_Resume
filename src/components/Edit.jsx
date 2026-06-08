import './components.css';

const EditSvg = ({ width, height, color }) => {
    return (
        <svg width={width} height={height}
            fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24" id="edit">
            {/* Outline pencil — same line weight as the (outline) Content document icon. */}
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
    )
}

export default EditSvg;