import Plus from "../../assets/icons/plus.svg?react";

const TaskCreateButton = () => (
  <div className="py-1 text-dark-gray">
    <button
      className="flex items-center justify-center w-full gap-1"
      type="button"
    >
      <Plus width={24} height={24} stroke="#696969" />
      <p>Task 생성하기</p>
    </button>
  </div>
);

export default TaskCreateButton;
