import React, { DragEvent } from "react";

interface EpicPageStoryDragContainerProps {
  epicIndex: number;
  storyIndex: number;
  setRef: (
    epicIndex: number,
    storyIndex: number
  ) => (element: HTMLDivElement) => void;
  onDragStart: () => void;
  onDragEnd: (event: DragEvent) => void;
  currentlyDraggedOver: boolean;
  children: React.ReactNode;
}

const EpicPageStoryDragContainer = ({
  epicIndex,
  storyIndex,
  setRef,
  onDragStart,
  onDragEnd,
  currentlyDraggedOver,
  children,
}: EpicPageStoryDragContainerProps) => (
  <div
    className="relative"
    ref={setRef(epicIndex, storyIndex)}
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

export default EpicPageStoryDragContainer;
