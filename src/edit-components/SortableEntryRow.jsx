import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Makes ONE list row (a section entry or a description bullet) draggable to reorder.
// Unlike SortableSection (whole wrapper = drag surface), the drag listeners live ONLY
// on the grip: rows are clickable (open the edit form) and bullets hold textareas, so
// a whole-row handle would swallow clicks and text selection. dnd-kit ids must be
// truthy — callers pass String(item.id) since real ids can be 0 or negative.
const SortableEntryRow = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    // Axis/bounds constraints live on each DndContext's modifiers — the
    // transform here just applies what they allow.
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
    };

    return (
        <div ref={setNodeRef} style={style} className='sortable-entry-row'>
            <div
                className='entry-drag-grip'
                aria-hidden='true'
                style={{ touchAction: 'none', cursor: 'grab' }}
                {...attributes}
                {...listeners}
            >⠿</div>
            {children}
        </div>
    );
};

export default SortableEntryRow;
