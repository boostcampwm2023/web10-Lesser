import { useState } from 'react';
import { useSelectedProjectState } from '../../../stores';

const useTaskUsername = (initialValue: number) => {
  const userList = useSelectedProjectState((state) => state.userList);

  const getUsernameByUserid = (userId: number | undefined) => {
    if (!userId) return '';

    return userList.find((user) => user.userId === Number(userId))?.userName ?? '';
  };

  const [username, setUsername] = useState<string>(getUsernameByUserid(initialValue));
  const setNewUsername = (id: number) => {
    setUsername(getUsernameByUserid(id));
  };

  return { username, setNewUsername };
};

export default useTaskUsername;
