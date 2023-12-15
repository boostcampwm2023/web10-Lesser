import { useState } from 'react';
import { useSelectedProjectState } from '../../../stores';

const useTaskUsername = (initialValue: number) => {
  const getUserNameById = useSelectedProjectState((state) => state.getUserNameById);
  const [username, setUsername] = useState<string>(getUserNameById(initialValue) ?? '미할당');
  const setNewUsername = (id: number) => {
    setUsername(getUserNameById(id));
  };
  const resetUsername = () => {
    setUsername('미할당');
  };

  return { username, setNewUsername, resetUsername };
};

export default useTaskUsername;
