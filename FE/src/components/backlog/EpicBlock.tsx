import { useState } from 'react';
import useBlock from '../../hooks/useBlock';
import StoryBlock from './StoryBlock';
import BlockForm from './BlockFrom';
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon';
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon';
import { BacklogState } from '../../types/backlog';
import EditIcon from '../../assets/icons/EditIcon';
import PlusIcon from '../../assets/icons/PlusIcon';

interface EpicBlockProps {
  epicIndex: number;
  backlogState: BacklogState;
  setBacklogState: React.Dispatch<React.SetStateAction<BacklogState>>;
}

const EpicBlock = ({ epicIndex, backlogState, setBacklogState }: EpicBlockProps) => {
  const epicTitle = backlogState.epicList[epicIndex].title;
  const {
    newFormVisible,
    updateFormVisible,
    formRef,
    handleAddBlockButtonClick,
    handleEditBlockButtonClick,
    handleFormSubmit,
  } = useBlock({
    block: backlogState,
    setBlock: setBacklogState,
    epicIndex: epicIndex,
  });
  const [epicVisible, setEpicVisibility] = useState<boolean>(true);

  const handleEpicToggleButtonClick = () => {
    setEpicVisibility(!epicVisible);
  };

  return (
    <div className="flex flex-col gap-5 py-[0.938rem] px-6 border border-house-green rounded-md">
      <div className="flex gap-[0.313rem]">
        <button onClick={handleEpicToggleButtonClick}>
          {epicVisible ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
        <div className="flex w-full gap-[0.563rem] text-house-green font-bold">
          <span className="text-l">{`Epic${epicIndex + 1}`}</span>
          {updateFormVisible ? (
            <BlockForm
              initialTitle={epicTitle}
              placeholder="어떤 기능을 계획할 예정인가요? 예시) 회원 기능"
              formRef={formRef}
              handleFormSubmit={(e) => handleFormSubmit(e, 'update', 'epicList')}
              onClose={handleEditBlockButtonClick}
            />
          ) : (
            <button
              className="group flex gap-[0.313rem] hover:underline items-center"
              onClick={handleEditBlockButtonClick}
            >
              {epicTitle}
              <span className="hidden group-hover:flex">
                <EditIcon color="text-house-green" size={16} />
              </span>
            </button>
          )}
        </div>
      </div>
      {epicVisible &&
        backlogState.epicList[epicIndex].storyList.map((story, storyIndex) => (
          <StoryBlock
            key={story.title}
            {...{ epicIndex, storyIndex }}
            backlogState={backlogState}
            setBacklogState={setBacklogState}
          />
        ))}

      {epicVisible &&
        (newFormVisible ? (
          <BlockForm
            initialTitle=""
            placeholder="이 기능에서 사용자는 어떤 것을 할 수 있나요? 예시) 사용자는 로그인 할 수 있다"
            formRef={formRef}
            handleFormSubmit={(e) => handleFormSubmit(e, 'add', 'storyList')}
            onClose={handleAddBlockButtonClick}
          />
        ) : (
          <button
            className="flex w-full py-[0.313rem] rounded-md text-center justify-center bg-accent-green font-bold text-true-white"
            onClick={handleAddBlockButtonClick}
          >
            <PlusIcon color="text-true-white" />
            {`Story 생성하기`}
          </button>
        ))}
    </div>
  );
};

export default EpicBlock;
