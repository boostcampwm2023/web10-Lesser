import { useState } from 'react';
import useGetUsername from './useGetUsername';

const useTaskUsername = (initialValue: number) => {
  const { getUsernameByUserid } = useGetUsername();
  const [username, setUsername] = useState<string>(getUsernameByUserid(initialValue) ?? '미할당');
  const setNewUsername = (id: number) => {
    setUsername(getUsernameByUserid(id));
  };
  const resetUsername = () => {
    setUsername('미할당');
  };

  return { username, setNewUsername, resetUsername };
};

export default useTaskUsername;
