import { useSelectedProjectState, useUserState } from '../../stores';

const MemberDropdown = ({
  setNewTaskManager,
}: {
  setNewTaskManager: ({ currentTarget }: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const clientUserId = useUserState((state) => state.id);
  const userList = useSelectedProjectState((state) => state.userList);
  return (
    <div className="absolute top-10 left-0 flex flex-col w-fit h-fit gap-0 bg-true-white border border-starbucks-green rounded-sm">
      {userList.map((user) => (
        <button
          type="button"
          className="flex gap-1 p-2 text-xs hover:bg-light-gray hover:text-true-white"
          key={user.userId}
          id={user.userId.toString()}
          onClick={setNewTaskManager}
        >
          <span>{user.userName}</span>
          {user.userId === clientUserId && <span>(나에게 할당)</span>}
        </button>
      ))}
    </div>
  );
};

export default MemberDropdown;