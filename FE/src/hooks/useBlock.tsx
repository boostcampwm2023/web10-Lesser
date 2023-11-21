import { useState, useRef, useEffect } from 'react';
import { BacklogState } from '../types/backlog';

interface BlockOptions {
  setBlock?: React.Dispatch<React.SetStateAction<BacklogState>>;
  epicIndex?: number;
  storyIndex?: number;
}

const useBlock = ({ setBlock, epicIndex, storyIndex }: BlockOptions = {}) => {
  const [isNewFormVisible, setNewFormVisibility] = useState<boolean>(false);
  const [isUpdateFormVisible, setUpdateFormVisibility] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddBlockButtonClick = () => {
    setNewFormVisibility(!isNewFormVisible);
  };

  const handleEditBlockButtonClick = () => {
    setUpdateFormVisibility(!isUpdateFormVisible);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setNewFormVisibility(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent, action: 'add' | 'update', currentBlock: 'epics' | 'stories') => {
    e.preventDefault();

    const blockTitle = formRef.current?.querySelector('input')?.value;

    if (blockTitle?.trim() === '') {
      return;
    }

    setBlock!((prevState) => {
      if (currentBlock === 'epics') {
        if (action === 'add') {
          const newEpic = {
            title: blockTitle!,
            stories: [],
          };

          return {
            ...prevState,
            epics: [...prevState.epics, newEpic],
          };
        } else {
          const updatedEpics = prevState.epics.map((epic, index) => {
            if (index === epicIndex) {
              return {
                ...epic,
                title: blockTitle!,
              };
            }
            return epic;
          });

          return {
            ...prevState,
            epics: updatedEpics,
          };
        }
      } else {
        if (action === 'add') {
          const newStory = {
            title: blockTitle!,
            tasks: [],
          };

          const updatedEpics = prevState.epics.map((epic, index) => {
            if (index === epicIndex) {
              return {
                ...epic,
                stories: [...epic.stories, newStory],
              };
            }
            return epic;
          });

          return {
            ...prevState,
            epics: updatedEpics,
          };
        } else {
          const updatedEpics = prevState.epics.map((epic, index) => {
            if (index === epicIndex) {
              const updatedStories = epic.stories.map((story, index) => {
                if (index === storyIndex) {
                  return {
                    ...story,
                    title: blockTitle!,
                  };
                }
                return story;
              });

              return {
                ...epic,
                stories: updatedStories,
              };
            }
            return epic;
          });

          return {
            ...prevState,
            epics: updatedEpics,
          };
        }
      }
    });

    setNewFormVisibility(false);
    setUpdateFormVisibility(false);
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return {
    isNewFormVisible,
    isUpdateFormVisible,
    formRef,
    handleAddBlockButtonClick,
    handleEditBlockButtonClick,
    handleFormSubmit,
  };
};

export default useBlock;
