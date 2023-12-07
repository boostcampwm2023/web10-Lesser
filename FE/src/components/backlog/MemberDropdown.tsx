import { useSelectedProjectState, useUserState } from '../../stores';

const MemberDropdown = () => {
  const clientUserId = useUserState((state) => state.id);
  const userList = useSelectedProjectState((state) => state.userList);

  return (
    <div className="absolute top-10 left-0 flex flex-col w-fit h-fit gap-0 bg-true-white border border-starbucks-green rounded-sm">
      {userList.map((user) => (
        <div className="flex gap-1 p-2 text-xs hover:bg-light-gray hover:text-true-white">
          <span>{user.userName}</span>
          {user.userId === clientUserId && <span>(나에게 할당)</span>}
        </div>
      ))}
    </div>
  );
};

export default MemberDropdown;
