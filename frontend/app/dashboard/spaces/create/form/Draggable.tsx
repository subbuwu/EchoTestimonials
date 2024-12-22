// Draggable.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { DraggableProps } from '@/types/form';

export const Draggable: React.FC<DraggableProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: id,
  });
  
  const style : React.CSSProperties = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 1 : undefined,
  } : {};

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

