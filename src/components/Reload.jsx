import './components.css';

// Reload glyph shown beside the "Load Example" button label. Naturally bold (solid
// filled paths, no stroke), so it reads thick without a stroke hack. The fill follows
// the `color` prop, and the dark-theme CSS override (.reload-svg fill:#fff) wins
// because no per-path fill is set.
const ReloadSvg = ({ color = '#000', width = '15px', height = '15px' }) => {
    return (
        <svg className="reload-svg"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style={{ width, height }}
            id="reload-svgrepo-com">
            <path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z"></path>
        </svg>
    );
};

export default ReloadSvg;
