import { useState, useRef, useEffect } from 'react';
import { BacklogState } from '../types/backlog';
import { api } from '../apis/api';

interface BlockOptions {
  block: BacklogState;
  setBlock: React.Dispatch<React.SetStateAction<BacklogState>>;
  epicIndex?: number;
  storyIndex?: number;
  taskIndex?: number;
}

const useBlock = ({ block, setBlock, epicIndex, storyIndex, taskIndex }: BlockOptions) => {
  const [newFormVisible, setNewFormVisibility] = useState<boolean>(false);
  const [updateFormVisible, setUpdateFormVisibility] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAddBlockButtonClick = () => {
    setNewFormVisibility(!newFormVisible);
  };

  const handleEditBlockButtonClick = () => {
    setUpdateFormVisibility(!updateFormVisible);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setNewFormVisibility(false);
    }
  };

  const handleFormSubmit = async (
    e: React.FormEvent,
    action: 'add' | 'update',
    currentBlock: 'epicList' | 'storyList' | 'taskList',
  ) => {
    e.preventDefault();

    const blockTitle = formRef.current?.querySelector('input')?.value;

    if (blockTitle?.trim() === '') {
      return;
    }

    try {
      if (currentBlock === 'epicList') {
        if (action === 'add') {
          const res = await api.post('/backlogs/epic', {
            projectId: 1,
            title: blockTitle,
          });

          const newEpic = {
            id: res.data.id,
            title: blockTitle!,
            storyList: [],
          };

          setBlock((prevState) => ({
            ...prevState,
            epicList: [...prevState.epicList, newEpic],
          }));
        } else {
          const updatedEpics = block.epicList.map((epic, index) => {
            if (index === epicIndex) {
              return {
                ...epic,
                title: blockTitle!,
              };
            }
            return epic;
          });

          api.put('/backlogs/epic', {
            id: block.epicList[epicIndex!].id,
            title: blockTitle,
          });

          setBlock((prevState) => ({
            ...prevState,
            epicList: updatedEpics,
          }));
        }
      } else if (currentBlock === 'storyList') {
        if (action === 'add') {
          const epicId = block.epicList[epicIndex!].id;
          const res = api.post('/backlogs/story', {
            epicId,
            title: blockTitle,
          });

          const newStory = {
            id: (await res).data.id,
            title: blockTitle!,
            taskList: [],
          };

          const updatedEpics = block.epicList.map((epic, index) => {
            if (index === epicIndex) {
              return {
                ...epic,
                storyList: [...epic.storyList, newStory],
              };
            }
            return epic;
          });

          setBlock(() => ({
            ...block,
            epicList: updatedEpics,
          }));
        } else {
          const updatedEpics = block.epicList.map((epic, index) => {
            if (index === epicIndex) {
              const updatedStories = epic.storyList.map((story, index) => {
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
                storyList: updatedStories,
              };
            }
            return epic;
          });

          api.put('/backlogs/story', {
            id: block.epicList[epicIndex!].storyList[storyIndex!].id,
            title: blockTitle,
          });

          setBlock(() => ({
            ...block,
            epicList: updatedEpics,
          }));
        }
      } else {
        const updatedEpics = [...block.epicList];
        const updatedStories = [...updatedEpics[epicIndex!].storyList];
        updatedStories[storyIndex!] = {
          ...updatedStories[storyIndex!],
          taskList: updatedStories[storyIndex!].taskList.map((task, index) => {
            if (index === taskIndex) {
              const { state, point, condition, userId } = task;
              api.patch('/backlogs/task', {
                id: block.epicList[epicIndex!].storyList[storyIndex!].taskList[taskIndex!].id,
                title: blockTitle,
                state,
                point,
                condition,
                userId,
              });
              return {
                ...task,
                title: blockTitle!,
              };
            }
            return task;
          }),
        };
        updatedEpics[epicIndex!] = {
          ...updatedEpics[epicIndex!],
          storyList: updatedStories,
        };
        setBlock(() => ({
          ...block,
          epicList: updatedEpics,
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    }

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
    newFormVisible,
    updateFormVisible,
    formRef,
    handleAddBlockButtonClick,
    handleEditBlockButtonClick,
    handleFormSubmit,
  };
};

export default useBlock;
