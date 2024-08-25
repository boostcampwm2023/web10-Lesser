import { DragEvent } from "react";

interface EpicPageTaskDragContainerProps {
  epicIndex: number;
  storyIndex: number;
  taskIndex: number;
  setRef: (
    epicIndex: number,
    storyIndex: number,
    taskIndex: number
  ) => (element: HTMLDivElement) => void;
  onDragStart: () => void;
  onDragEnd: (event: DragEvent) => void;
  currentlyDraggedOver: boolean;
  children: React.ReactNode;
}

const EpicPageTaskDragContainer = ({
  epicIndex,
  storyIndex,
  taskIndex,
  setRef,
  onDragStart,
  onDragEnd,
  currentlyDraggedOver,
  children,
}: EpicPageTaskDragContainerProps) => (
  <div
    className="relative"
    ref={setRef(epicIndex, storyIndex, taskIndex)}
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

export default EpicPageTaskDragContainer;
