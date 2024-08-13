import React, { DragEvent } from "react";

interface StoryDragContainerProps {
  index: number;
  setRef: (index: number) => (element: HTMLDivElement) => void;
  onDragStart: () => void;
  onDragEnd: (event: DragEvent) => void;
  currentlyDraggedOver: boolean;
  children: React.ReactNode;
}

const StoryDragContainer = ({
  index,
  setRef,
  onDragStart,
  onDragEnd,
  currentlyDraggedOver,
  children,
}: StoryDragContainerProps) => (
  <div
    className="relative"
    ref={setRef(index)}
    draggable={true}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
  >
    <div
      className={`${
        currentlyDraggedOver ? "w-full h-1 bg-blue-400" : ""
      } absolute`}
    />
    {children}
  </div>
);

export default StoryDragContainer;
