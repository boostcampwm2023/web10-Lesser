import { useState } from 'react';
import useGetUsername from './useGetUsername';

const useTaskUsername = (initialValue: number) => {
  const { getUsernameByUserid } = useGetUsername();
  const [username, setUsername] = useState<string>(getUsernameByUserid(initialValue));
  const setNewUsername = (id: number) => {
    setUsername(getUsernameByUserid(id));
  };

  return { username, setNewUsername };
};

export default useTaskUsername;
