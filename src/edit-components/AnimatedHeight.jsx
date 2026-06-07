import { useRef, useState, useLayoutEffect } from 'react';
import './animatedHeight.css';

// Animates its own height to fit whatever children it's given, transitioning smoothly
// when the children (and thus their height) change — e.g. swapping the section's item
// LIST for the edit FORM. The outer container is always mounted, so there's no remount
// flicker; we measure the inner content with a ResizeObserver and transition `height`.
// (Measured-height approach — works in all browsers; see research notes in commit.)
const AnimatedHeight = ({ children, duration = 600 }) => {
    const innerRef = useRef(null);
    const [height, setHeight] = useState('auto');
    // After the first paint we switch from 'auto' to a measured pixel height so the
    // transition has concrete endpoints. `firstRun` avoids animating the initial mount.
    const firstRun = useRef(true);

    useLayoutEffect(() => {
        const el = innerRef.current;
        if (!el) return undefined;

        const measure = () => {
            const next = el.offsetHeight;
            if (firstRun.current) {
                firstRun.current = false;
                setHeight(next);
                return;
            }
            setHeight(next);
        };

        measure();
        // Re-measure when the inner content changes size (form fields added, list grows…).
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [children]);

    return (
        <div
            className="animated-height"
            style={{ height: height === 'auto' ? 'auto' : `${height}px`, transition: `height ${duration}ms ease` }}
        >
            <div ref={innerRef} className="animated-height-inner">
                {children}
            </div>
        </div>
    );
};

export default AnimatedHeight;
