import BlockForm from '../components/backlog/BlockFrom';
import EpicBlock from '../components/backlog/EpicBlock';
import useBlock from '../hooks/useBlock';
import { useEffect, useState } from 'react';
import { BacklogState } from '../types/backlog';
import PlusIcon from '../assets/icons/PlusIcon';
import { api } from '../apis/api';

const BacklogPage = () => {
  const [backlogState, setBacklogState] = useState<BacklogState>({
    epicList: [],
  });

  const fetchEpics = async () => {
    const response = await api.get('/backlogs/1');
    const epicList = await response.data.epicList;
    setBacklogState({ epicList });
  };

  useEffect(() => {
    fetchEpics();
  }, []);

  const { newFormVisible, formRef, handleAddBlockButtonClick, handleFormSubmit } = useBlock({
    block: backlogState,
    setBlock: setBacklogState,
  });
  console.log(backlogState.epicList);

  return (
    <main className="flex flex-col min-w-[60.25rem] font-pretendard select-none">
      <header className="flex items-center gap-[0.563rem] mb-3">
        <span className="font-bold text-l text-house-green">백로그</span>
        <span className="">여러분이 개발해야 할 기능과 제품의 요구 기능을 작성합니다</span>
      </header>
      <div className="flex flex-col gap-4">
        {backlogState.epicList.map((epic, index) => (
          <EpicBlock key={epic.id} epicIndex={index} backlogState={backlogState} setBacklogState={setBacklogState} />
        ))}
      </div>
      {newFormVisible ? (
        <BlockForm
          initialTitle=""
          placeholder="어떤 기능을 계획할 예정인가요? 예시) 회원 기능"
          formRef={formRef}
          handleFormSubmit={(e) => handleFormSubmit(e, 'add', 'epicList')}
          onClose={handleAddBlockButtonClick}
        />
      ) : (
        <button
          className={`flex w-full py-[0.313rem] mt-4 rounded-md text-center justify-center bg-house-green font-bold text-true-white`}
          onClick={handleAddBlockButtonClick}
        >
          <PlusIcon color="text-true-white" />
          {`Epic 생성하기`}
        </button>
      )}
    </main>
  );
};

export default BacklogPage;
