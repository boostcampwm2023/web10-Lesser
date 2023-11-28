import { UserFilter, TaskGroup } from '../../types/sprint';

interface User {
  id?: number;
  name: string;
}

interface FilterDropdownProps {
  userList: User[];
  userToFilter: UserFilter;
  taskGroup: TaskGroup;
  onClickUserFilterButton: (user: UserFilter) => void;
  onClickGroupFilterButton: (group: TaskGroup) => void;
}

const FilterDropdown = (props: FilterDropdownProps) => {
  const { userToFilter, taskGroup, userList, onClickGroupFilterButton, onClickUserFilterButton } = props;

  const activeMenuClass = 'text-starbucks-green font-medium';
  const inactiveMenuClass = 'text-green-stroke';

  return (
    <ul className="flex flex-col gap-1.5 absolute w-32 p-3 border rounded top-8 border-green-stroke bg-true-white">
      <p className="font-bold text-center ">멤버별 필터</p>
      {userList.map(({ id, name }) => (
        <p
          key={id}
          className={`text-center text-xs hover:cursor-pointer ${
            name === userToFilter ? activeMenuClass : inactiveMenuClass
          }`}
          onClick={() => onClickUserFilterButton(name)}
        >
          {name}
        </p>
      ))}
      <hr className="bg-green-stroke" />
      <p className="font-bold text-center ">그룹화</p>
      <p
        className={`text-center text-xs hover:cursor-pointer ${
          taskGroup === 'all' ? activeMenuClass : inactiveMenuClass
        }`}
        onClick={() => onClickGroupFilterButton('all')}
      >
        전체 태스크
      </p>
      <p
        className={`text-center text-xs hover:cursor-pointer ${
          taskGroup === 'story' ? activeMenuClass : inactiveMenuClass
        }`}
        onClick={() => onClickGroupFilterButton('story')}
      >
        스토리 그룹
      </p>
    </ul>
  );
};

export default FilterDropdown;
