import React, { useState } from 'react';
import { BacklogState, TaskData } from '../../types/backlog';
import { api } from '../../apis/api';

interface TaskModalProps {
  onClose: () => void;
  backlogState: BacklogState;
  setBacklogState: React.Dispatch<React.SetStateAction<BacklogState>>;
  task?: TaskData;
  epicIndex: number;
  storyIndex: number;
  taskIndex?: number;
}

const TaskModal = ({
  onClose,
  backlogState,
  setBacklogState,
  task,
  epicIndex,
  storyIndex,
  taskIndex,
}: TaskModalProps) => {
  const [taskData, setTaskData] = useState<TaskData>(
    task
      ? task
      : {
          title: '',
          userName: '',
          point: 0,
          state: 'ToDo',
          condition: '',
          userId: 0,
        },
  );
  const [editTask, setEditTask] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = Number(value);

    setTaskData((prevData) => ({ ...prevData, [name]: isNaN(parsedValue) ? 0 : parsedValue }));
    e.target.value = parsedValue.toString();
  };

  const handleCreateTaskButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (taskData.title.trim() === '' || taskData.userName.trim() === '' || taskData.condition.trim() === '') {
      return;
    }

    const { title, state, point, condition, userId } = taskData;
    if (task) {
      api.patch('/backlogs/task', {
        id: backlogState.epicList[epicIndex!].storyList[storyIndex!].taskList[taskIndex!].id,
        title,
        state,
        point,
        condition,
        userId,
      });
    } else {
      const storyId = backlogState.epicList[epicIndex].storyList[storyIndex].id;
      const res = api.post('/backlogs/story', {
        storyId,
        title,
        state,
        point,
        condition,
        userId,
      });
      const id = (await res).data.id;
      setTaskData((prevData) => ({ ...prevData, id }));
    }

    setBacklogState((prevState) => {
      const updatedEpics = [...prevState.epicList];
      const updatedStories = [...updatedEpics[epicIndex].storyList];

      if (task) {
        updatedStories[storyIndex].taskList[taskIndex!] = taskData;
      } else {
        updatedStories[storyIndex] = {
          ...updatedStories[storyIndex],
          taskList: [...updatedStories[storyIndex].taskList, taskData],
        };
      }

      updatedEpics[epicIndex] = {
        ...updatedEpics[epicIndex],
        storyList: updatedStories,
      };
      return { ...prevState, epicList: updatedEpics };
    });

    setTaskData({
      title: '',
      point: 0,
      userName: '',
      state: 'ToDo',
      condition: '',
      userId: 0,
    });
    onClose();
  };

  const handleUpdateTaskButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditTask(!editTask);
  };

  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-[31.875rem] h-[33.75rem] rounded-md bg-white p-6 text-house-green">
        <form className="flex flex-col h-full justify-between">
          <p className="text-l font-bold">Task</p>
          <div className="flex flex-col gap-2">
            <label className="text-s" htmlFor="title">
              <span className="text-m font-bold pr-2">업무 내용</span>
              Story를 구현하기 위해 필요한 업무를 작성합니다
            </label>
            <input
              className={`w-full py-2 px-2.5 ${
                editTask || !task
                  ? 'border rounded-sm border-starbucks-green outline-starbucks-green text-s'
                  : 'bg-transparent text-r'
              } `}
              type="text"
              id="title"
              name="title"
              placeholder="어떤 업무를 수행할 예정인가요?"
              value={taskData.title}
              onChange={handleInputChange}
              disabled={!editTask && !!task}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-s" htmlFor="condition">
              <span className="text-m font-bold pr-2">인수조건</span>
              Task를 완료하기 위한 조건을 작성합니다.
            </label>

            <textarea
              className={`w-full py-2 px-2.5 resize-none ${
                editTask || !task
                  ? 'border rounded-sm border-starbucks-green outline-starbucks-green text-s'
                  : 'bg-transparent text-r'
              }`}
              rows={editTask || !task ? 4 : 0}
              id="condition"
              name="condition"
              placeholder={
                '예시 조건)\n' +
                '몇 개의 테스트 코드를 통과해야 합니다\n' +
                '사전에 작성한 예상 유저 시나리오와 비교하여 동작을 확인합니다'
              }
              value={taskData.condition}
              onChange={handleInputChange}
              disabled={!editTask && !!task}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="userName" className="text-s">
              <span className="text-m font-bold pr-2">담당자</span>
              Task를 수행할 멤버를 선정합니다
            </label>
            <input
              className={`w-[9.375rem] py-2 px-2.5 ${
                editTask || !task
                  ? 'border rounded-sm border-starbucks-green outline-starbucks-green text-s'
                  : 'bg-transparent text-r'
              }`}
              type="text"
              id="userName"
              name="userName"
              placeholder="담당자"
              value={taskData.userName}
              onChange={handleInputChange}
              disabled={!editTask && !!task}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="point" className="text-s">
              <span className="text-m font-bold pr-2">Point</span>
              Task를 완료하기 위해 소요되는 시간을 예상합니다
            </label>

            <div
              className={`flex w-[9.375rem] pr-3 items-center ${
                editTask || !task ? 'border rounded-sm border-starbucks-green' : ''
              } justify-between`}
            >
              <input
                className={`w-full py-2 px-2.5 ${editTask || !task ? 'text-s outline-none' : 'bg-transparent text-r'}`}
                type="number"
                id="point"
                name="point"
                value={taskData.point}
                onChange={handleNumberInputChange}
                disabled={!editTask && !!task}
              />
              <p className="font-bold text-starbucks-green">Point</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="border-2 rounded-md border-starbucks-green px-4 py-1.5 font-bold text-starbucks-green text-s"
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
            >
              {editTask || !task ? '취소' : '닫기'}
            </button>

            <button
              className="border-2 rounded-md border-starbucks-green px-4 py-1.5 bg-starbucks-green font-bold text-true-white text-s"
              onClick={editTask || !task ? handleCreateTaskButtonClick : handleUpdateTaskButtonClick}
            >
              {editTask || !task ? '확인' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
