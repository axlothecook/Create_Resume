import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Wraps a left-panel section so it can be dragged to reorder when reorder mode is on.
// The whole wrapper is the drag handle (listeners spread on the container) and a small
// grip indicator hints at the affordance. dnd-kit's sensors cover mouse, touch and
// keyboard, so this works on phones as well as desktop.
const SortableSection = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none', // let dnd-kit handle the touch gesture instead of scrolling
        cursor: 'grab',
        position: 'relative',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className='sortable-section'>
            <div className='drag-grip' aria-hidden='true'>⠿</div>
            {children}
        </div>
    );
};

export default SortableSection;
