import useShowDetail from "../../hooks/pages/backlog/useShowDetail";
import TaskCreateButton from "./TaskCreateButton";
import TaskCreateForm from "./TaskCreateForm";

interface TaskCreateBlockProps {
  storyId: number;
  lastTaskRankValue?: string;
}

const TaskCreateBlock = ({
  storyId,
  lastTaskRankValue,
}: TaskCreateBlockProps) => {
  const { showDetail, handleShowDetail } = useShowDetail();
  return (
    <>
      {showDetail ? (
        <TaskCreateForm
          {...{ storyId, lastTaskRankValue }}
          onCloseClick={() => handleShowDetail(false)}
        />
      ) : (
        <TaskCreateButton onClick={() => handleShowDetail(true)} />
      )}
    </>
  );
};

export default TaskCreateBlock;
