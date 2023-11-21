import BlockForm from '../../components/backlog/BlockFrom';
import EpicBlock from '../../components/backlog/EpicBlock';
import useBlock from '../../hooks/useBlock';
import { useState } from 'react';
import { BacklogState } from '../../types/backlog';
import PlusIcon from '../../assets/icons/PlusIcon';

const BacklogPage = () => {
  const [backlogState, setBacklogState] = useState<BacklogState>({
    epics: [],
  });

  const { isNewFormVisible, formRef, handleAddBlockButtonClick, handleFormSubmit } = useBlock({
    setBlock: setBacklogState,
  });

  return (
    <main className="flex flex-col gap-5 font-pretendard select-none">
      <header className="flex items-center gap-3">
        <span className="font-bold text-l text-house-green">백로그</span>
        <span className="">여러분이 개발해야 할 기능과 제품의 요구 기능을 작성합니다</span>
      </header>
      {backlogState.epics.map((epic, index) => (
        <EpicBlock key={epic.title} epicIndex={index} backlogState={backlogState} setBacklogState={setBacklogState} />
      ))}
      {isNewFormVisible ? (
        <BlockForm
          initialTitle=""
          formRef={formRef}
          handleFormSubmit={(e) => handleFormSubmit(e, 'add', 'epics')}
          onClose={handleAddBlockButtonClick}
        />
      ) : (
        <button
          className={`flex w-full py-1 rounded-md text-center justify-center bg-house-green font-bold text-true-white`}
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
