import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { DroppableProps } from '@/types/form';

export const Droppable: React.FC<DroppableProps> = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const style: React.CSSProperties = {
    position: 'relative',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={isOver ? 'ring-2 ring-primary ring-offset-2' : undefined}
    >
      {children}
    </div>
  );
};