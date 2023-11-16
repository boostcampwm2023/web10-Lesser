import React, { useState } from 'react';

export interface TaskData {
  title: string;
  member: string;
  point: number;
  completionCondition: string;
}

interface TaskModalProps {
  onClose: () => void;
  onTaskCreate: (taskData: TaskData) => void;
}

const TaskModal = ({ onClose, onTaskCreate }: TaskModalProps) => {
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    member: '',
    point: 0,
    completionCondition: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value, 10);
    setTaskData((prevData) => ({ ...prevData, [name]: isNaN(parsedValue) ? 0 : parsedValue }));
  };

  const handleCreateTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    onTaskCreate(taskData);
    setTaskData({
      title: '',
      point: 0,
      member: '',
      completionCondition: '',
    });
    onClose();
  };

  return (
    <div className="modal">
      <form className="modal-content">
        <h2 className="text-lg font-semibold">TASK MODAL</h2>
        <label htmlFor="title">제목:</label>
        <input type="text" id="title" name="title" value={taskData.title} onChange={handleInputChange} />
        <label htmlFor="point">포인트:</label>
        <input type="number" id="point" name="point" value={taskData.point} onChange={handleNumberInputChange} />
        <label htmlFor="member">멤버:</label>
        <input type="text" id="member" name="member" value={taskData.member} onChange={handleInputChange} />
        <label htmlFor="completionCondition">완료 조건:</label>
        <input
          type="text"
          id="completionCondition"
          name="completionCondition"
          value={taskData.completionCondition}
          onChange={handleInputChange}
        />
        <button className="border px-8" onClick={handleCreateTask}>
          생성
        </button>
        <button
          className="border px-8"
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          취소
        </button>
      </form>
    </div>
  );
};

export default TaskModal;
