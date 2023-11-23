import BlockForm from '../components/backlog/BlockFrom';
import EpicBlock from '../components/backlog/EpicBlock';
import useBlock from '../hooks/useBlock';
import { useState } from 'react';
import { BacklogState } from '../types/backlog';
import PlusIcon from '../assets/icons/PlusIcon';
import axios from 'axios';

const BacklogPage = () => {
  axios
    .get('https://lesser-project.site/api/backlogs/1')
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));

  const [backlogState, setBacklogState] = useState<BacklogState>({
    epics: [],
  });

  const { newFormVisible, formRef, handleAddBlockButtonClick, handleFormSubmit } = useBlock({
    setBlock: setBacklogState,
  });

  return (
    <main className="flex flex-col min-w-[60.25rem] font-pretendard select-none">
      <header className="flex items-center gap-[0.563rem] mb-3">
        <span className="font-bold text-l text-house-green">백로그</span>
        <span className="">여러분이 개발해야 할 기능과 제품의 요구 기능을 작성합니다</span>
      </header>
      <div className="flex flex-col gap-4">
        {backlogState.epics.map((epic, index) => (
          <EpicBlock key={epic.title} epicIndex={index} backlogState={backlogState} setBacklogState={setBacklogState} />
        ))}
      </div>
      {newFormVisible ? (
        <BlockForm
          initialTitle=""
          placeholder="어떤 기능을 계획할 예정인가요? 예시) 회원 기능"
          formRef={formRef}
          handleFormSubmit={(e) => handleFormSubmit(e, 'add', 'epics')}
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
