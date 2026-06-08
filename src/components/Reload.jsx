import './components.css';

// Loading/reload glyph shown beside the "Load Example" button label.
const ReloadSvg = ({ color = '#000', width = '15px', height = '15px' }) => {
    return (
        <svg className="reload-svg"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 367.136 367.136"
            style={{ width, height }}
            id="loading-svgrepo-com">
            {/* A matching stroke thickens the fill-based glyph slightly. */}
            <path stroke={color} strokeWidth="14" d="M336.954,87.494C318.821,59.1,293.251,36.318,263.01,21.613l-13.119,26.979c52.77,25.661,85.551,78.029,85.551,136.669c0,83.744-68.131,151.874-151.874,151.874S31.694,269.005,31.694,185.262c0-49.847,24.899-96.439,65.042-124.571L149.7,113.91V0H36.335l38.953,39.14C57.727,52.164,42.557,68.287,30.582,86.871c-18.898,29.33-28.888,63.352-28.888,98.391c0,100.286,81.588,181.874,181.874,181.874s181.874-81.588,181.874-181.874C365.442,150.485,355.59,116.678,336.954,87.494z" />
        </svg>
    );
};

export default ReloadSvg;
