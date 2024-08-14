import React, { DragEvent } from "react";

interface EpicDragContainerProps {
  epicIndex: number;
  setRef: (epicIndex: number) => (element: HTMLDivElement) => void;
  onDragStart: () => void;
  onDragEnd: (event: DragEvent) => void;
  currentlyDraggedOver: boolean;
  children: React.ReactNode;
}

const EpicDragContainer = ({
  epicIndex,
  setRef,
  onDragStart,
  onDragEnd,
  currentlyDraggedOver,
  children,
}: EpicDragContainerProps) => (
  <div
    className="relative"
    ref={setRef(epicIndex)}
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

export default EpicDragContainer;
