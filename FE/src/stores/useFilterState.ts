import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TaskGroup, UserFilter } from '../types/sprint';

interface InitialFilterState {
  userToFilter: UserFilter;
  taskGroup: TaskGroup;
}

interface FilterState extends InitialFilterState {
  changeUserToFilter: (userToFilter: UserFilter) => void;
  changeTaskGroup: (taskGroup: TaskGroup) => void;
}

const initialState: InitialFilterState = { userToFilter: -1, taskGroup: 'all' };

const useFilterState = create<FilterState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        changeUserToFilter: (userToFilter: UserFilter) => {
          const { taskGroup } = get();
          set(() => ({ userToFilter, taskGroup }));
        },
        changeTaskGroup: (taskGroup: TaskGroup) => {
          const { userToFilter } = get();
          set(() => ({ userToFilter, taskGroup }));
        },
      }),
      { name: 'filterState' },
    ),
  ),
);

export default useFilterState;
