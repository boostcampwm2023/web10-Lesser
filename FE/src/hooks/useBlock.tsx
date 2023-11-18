import { useState, useRef, useEffect } from 'react';
import { TaskData } from '../components/backlog/TaskModal';

export interface BacklogState {
  epics: {
    title: string;
    stories: {
      title: string;
      tasks: TaskData[];
    }[];
  }[];
}

interface UseBlockProps {
  currentBlock?: 'epics' | 'stories';
  setBlock?: React.Dispatch<React.SetStateAction<BacklogState>>;
  epicIndex?: number;
}

const useBlock = ({ currentBlock, setBlock, epicIndex }: UseBlockProps = {}) => {
  const [newBlockTitle, setNewBlockTitle] = useState<string>('');
  const [formVisibility, setFormVisibility] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddBlock = () => {
    setFormVisibility(!formVisibility);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setFormVisibility(false);
      setNewBlockTitle('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlockTitle.trim() === '') {
      return;
    }

    setBlock!((prevState) => {
      if (currentBlock === 'epics') {
        const newEpic = {
          title: newBlockTitle,
          stories: [],
        };

        return {
          ...prevState,
          epics: [...prevState.epics, newEpic],
        };
      } else {
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
      }
    });

    setNewBlockTitle('');
    setFormVisibility(false);
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    newBlockTitle,
    formVisibility,
    formRef,
    handleAddBlock,
    handleFormSubmit,
    setNewBlockTitle,
  };
};

export default useBlock;
