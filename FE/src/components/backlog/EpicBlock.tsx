import { useState } from 'react';
import useBlock from '../../hooks/useBlock';
import StoryBlock from './StoryBlock';

interface EpicBlockProps {
  epicTitle: string;
}

const EpicBlock = ({ epicTitle }: EpicBlockProps) => {
  const { items, newItemTitle, showForm, formRef, handleAddButton, handleFormSubmit, setNewItemTitle } = useBlock();
  const [showEpic, setShowEpic] = useState<boolean>(true);
  const handleToggleEpic = () => {
    setShowEpic(!showEpic);
  };

  return (
    <div className="my-5 border-2 border-red-600">
      <div className="flex gap-2">
        <h2>{epicTitle}</h2>
        <button className="border" onClick={handleToggleEpic}>
          Toggle Epic
        </button>
      </div>
      {showEpic && items.map((item) => <StoryBlock key={item} storyTitle={item} />)}
      {showForm ? (
        <form ref={formRef} onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder={`Enter Story Title`}
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
          />
          <button className="border px-8" type="submit">
            + Story 생성하기
          </button>
        </form>
      ) : (
        <button className="border px-8" onClick={handleAddButton}>
          + Story 생성하기
        </button>
      )}
    </div>
  );
};

export default EpicBlock;
