import { useSelectedProjectState } from '../../../stores';

const useGetUsername = () => {
  const userList = useSelectedProjectState((state) => state.userList);

  const getUsernameByUserid = (userId: number | undefined) => {
    if (!userId) return '';

    return userList.find((user) => user.userId === Number(userId))?.userName ?? '';
  };

  return { getUsernameByUserid };
};

export default useGetUsername;
