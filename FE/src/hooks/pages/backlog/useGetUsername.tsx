import { useSelectedProjectState } from '../../../stores';

const useGetUsername = () => {
  const userList = useSelectedProjectState((state) => state.userList);

  const getUsernameByUserid = (userId: number | undefined) => {
    if (!userId) return '미할당';

    return userList.find((user) => user.userId === Number(userId))?.userName ?? '미할당';
  };

  return { getUsernameByUserid };
};

export default useGetUsername;
