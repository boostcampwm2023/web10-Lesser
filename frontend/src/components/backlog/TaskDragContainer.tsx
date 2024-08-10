import { DragEvent } from "react";

interface TaskDragContainerProps {
  storyIndex: number;
  taskIndex: number;
  setRef: (
    storyIndex: number,
    taskIndex: number
  ) => (element: HTMLDivElement) => void;
  onDragStart: () => void;
  onDragEnd: (event: DragEvent) => void;
  currentlyDraggedOver: boolean;
  children: React.ReactNode;
}

const TaskDragContainer = ({
  storyIndex,
  taskIndex,
  setRef,
  onDragStart,
  onDragEnd,
  currentlyDraggedOver,
  children,
}: TaskDragContainerProps) => (
  <div
    className="relative"
    ref={setRef(storyIndex, taskIndex)}
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

export default TaskDragContainer;
