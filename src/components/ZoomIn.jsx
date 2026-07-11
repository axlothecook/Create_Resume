const ZoomInSvg = ({ color = 'currentColor', width = '20px', height = '20px' }) => {
    return (
        <svg width={width} height={height} fill="none"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="zoom-in">
            <path d="M20 20L14.9497 14.9497M14.9497 14.9497C16.2165 13.683 17 11.933 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17C11.933 17 13.683 16.2165 14.9497 14.9497ZM7 10H13M10 7V13"
                stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
    )
}

export default ZoomInSvg;
