import './components.css';

// Pill toggle for light/dark theme, modelled on the reference image:
// a dark rounded track with a white knob that slides left<->right, and the
// opposite-state icon peeking out on the track behind the knob.
//
// State mapping (App.jsx): theme === false -> LIGHT, theme === true -> DARK.
//  - DARK active  (theme true):  knob LEFT,  orange SUN shows on the right.
//  - LIGHT active (theme false): knob RIGHT, yellow MOON shows on the left.
const ThemeSlider = ({ themeProp, setThemeProp }) => {
    const isDark = themeProp;

    return (
        <button
            type='button'
            className={`theme-slider ${isDark ? 'is-dark' : 'is-light'}`}
            role='switch'
            aria-checked={isDark}
            aria-label='Toggle dark mode'
            onClick={() => setThemeProp(!themeProp)}
        >
            {/* Sun — visible when dark mode is active (knob on the left). */}
            <span className='theme-slider-icon theme-slider-sun' aria-hidden='true'>
                <svg viewBox='0 0 24 24' width='12' height='12' fill='#f5a623'>
                    <circle cx='12' cy='12' r='5' />
                    <g stroke='#f5a623' strokeWidth='2' strokeLinecap='round'>
                        <line x1='12' y1='1' x2='12' y2='4' />
                        <line x1='12' y1='20' x2='12' y2='23' />
                        <line x1='1' y1='12' x2='4' y2='12' />
                        <line x1='20' y1='12' x2='23' y2='12' />
                        <line x1='4.2' y1='4.2' x2='6.3' y2='6.3' />
                        <line x1='17.7' y1='17.7' x2='19.8' y2='19.8' />
                        <line x1='4.2' y1='19.8' x2='6.3' y2='17.7' />
                        <line x1='17.7' y1='6.3' x2='19.8' y2='4.2' />
                    </g>
                </svg>
            </span>

            {/* Moon — visible when light mode is active (knob on the right). */}
            <span className='theme-slider-icon theme-slider-moon' aria-hidden='true'>
                <svg viewBox='0 0 24 24' width='12' height='12' fill='#f1c40f'>
                    <path d='M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z' />
                </svg>
            </span>

            {/* The sliding white knob. */}
            <span className='theme-slider-knob' aria-hidden='true' />
        </button>
    );
};

export default ThemeSlider;
