import { ProjectUser } from '../../types/project';
import { UserFilter, TaskGroup } from '../../types/sprint';

interface FilterDropdownProps {
  userList: ProjectUser[];
  userToFilter: UserFilter;
  taskGroup: TaskGroup;
  onUserFilterButtonClick: (user: UserFilter, group: TaskGroup) => void;
  onGroupFilterButtonClick: (user: UserFilter, group: TaskGroup) => void;
}

const FilterDropdown = (props: FilterDropdownProps) => {
  const { userToFilter, taskGroup, userList, onGroupFilterButtonClick, onUserFilterButtonClick } = props;

  const activeMenuClass = 'text-starbucks-green font-medium';
  const inactiveMenuClass = 'text-green-stroke';

  return (
    <ul className="flex flex-col gap-1.5 absolute w-32 p-3 border rounded top-8 border-green-stroke bg-true-white">
      <p className="font-bold text-center ">멤버별 필터</p>
      {userList.map(({ userId, userName }) => (
        <p
          key={userId}
          className={`text-center text-xs hover:cursor-pointer ${
            userId === userToFilter ? activeMenuClass : inactiveMenuClass
          }`}
          onClick={() => onUserFilterButtonClick(userId, taskGroup)}
        >
          {userName}
        </p>
      ))}
      <hr className="bg-green-stroke" />
      <p className="font-bold text-center ">그룹화</p>
      <p
        className={`text-center text-xs hover:cursor-pointer ${
          taskGroup === 'all' ? activeMenuClass : inactiveMenuClass
        }`}
        onClick={() => onGroupFilterButtonClick(userToFilter, 'all')}
      >
        전체 태스크
      </p>
      <p
        className={`text-center text-xs hover:cursor-pointer ${
          taskGroup === 'story' ? activeMenuClass : inactiveMenuClass
        }`}
        onClick={() => onGroupFilterButtonClick(userToFilter, 'story')}
      >
        스토리 그룹
      </p>
    </ul>
  );
};

export default FilterDropdown;
