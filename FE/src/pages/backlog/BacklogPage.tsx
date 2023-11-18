import BlockForm from '../../components/backlog/BlockFrom';
import EpicBlock from '../../components/backlog/EpicBlock';
import useBlock, { BacklogState } from '../../hooks/useBlock';
import { useState } from 'react';

const BacklogPage = () => {
  const [backlogState, setBacklogState] = useState<BacklogState>({
    epics: [],
  });

  const { newBlockTitle, formVisibility, formRef, handleAddBlock, handleFormSubmit, setNewBlockTitle } = useBlock({
    currentBlock: 'epics',
    setBlock: setBacklogState,
  });

  return (
    <div className="border-2 border-black">
      <h1>Backlog Page</h1>
      {backlogState.epics.map((epic, index) => (
        <EpicBlock key={epic.title} epicIndex={index} backlogState={backlogState} setBacklogState={setBacklogState} />
      ))}
      <BlockForm
        formRef={formRef}
        newBlockTitle={newBlockTitle}
        setNewBlockTitle={setNewBlockTitle}
        formVisibility={formVisibility}
        handleFormSubmit={handleFormSubmit}
        handleAddBlock={handleAddBlock}
        buttonText="+ Epic 생성하기"
      />
    </div>
  );
};

export default BacklogPage;
