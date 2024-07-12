import useShowDetail from "../../hooks/pages/backlog/useShowDetail";
import TaskCreateButton from "./TaskCreateButton";
import TaskCreateForm from "./TaskCreateForm";

interface TaskCreateBlockProps {
  storyId: number;
}

const TaskCreateBlock = ({ storyId }: TaskCreateBlockProps) => {
  const { showDetail, handleShowDetail } = useShowDetail();
  return (
    <>
      {showDetail ? (
        <TaskCreateForm
          {...{ storyId }}
          onCloseClick={() => handleShowDetail(false)}
        />
      ) : (
        <TaskCreateButton onClick={() => handleShowDetail(true)} />
      )}
    </>
  );
};

export default TaskCreateBlock;
