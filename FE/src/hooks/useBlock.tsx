import { useState, useRef, useEffect } from 'react';
import { BacklogState } from '../types/backlog';

interface BlockOptions {
  currentBlock?: 'epics' | 'stories';
  setBlock?: React.Dispatch<React.SetStateAction<BacklogState>>;
  epicIndex?: number;
  storyIndex?: number;
  initailTitle?: string;
}

const useBlock = ({ currentBlock, setBlock, epicIndex, storyIndex, initailTitle }: BlockOptions = {}) => {
  const [newBlockTitle, setNewBlockTitle] = useState<string>('');
  const [updateBlockTitle, setUpdateBlockTitle] = useState<string>(initailTitle!);
  const [isNewFormVisible, setNewFormVisibility] = useState<boolean>(false);
  // const [isUpdateFormVisible, setUpdateFormVisibility] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleAddBlockButtonClick = () => {
    setNewFormVisibility(!isNewFormVisible);
    setNewBlockTitle('');
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setNewFormVisibility(false);
      setNewBlockTitle('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent, action: 'add' | 'update') => {
    e.preventDefault();
    if (newBlockTitle.trim() === '') {
      return;
    }

    setBlock!((prevState) => {
      if (currentBlock === 'epics') {
        if (action === 'add') {
          const newEpic = {
            title: newBlockTitle,
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
                title: newBlockTitle,
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
            title: newBlockTitle,
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
                    title: newBlockTitle,
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

    setNewBlockTitle('');
    setNewFormVisibility(false);
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return {
    newBlockTitle,
    updateBlockTitle,
    isNewFormVisible,
    formRef,
    handleAddBlockButtonClick,
    handleFormSubmit,
    setNewBlockTitle,
    setUpdateBlockTitle,
  };
};

export default useBlock;
