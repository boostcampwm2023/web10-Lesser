import { useSelectedProjectState } from '../stores';

const getUsernameByUserid = (userId: number | undefined) => {
  if (!userId) return '';

  const userList = useSelectedProjectState((state) => state.userList);
  return userList.find((user) => user.userId === Number(userId))?.userName;
};

export default getUsernameByUserid;
