import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SelectedProjectData } from '../types/project';

interface SelectedProjectState extends SelectedProjectData {
  updateProjectData: ({ id, userList }: SelectedProjectData) => void;
  deleteProjectData: () => void;
  getUserNameById: (userId: number | undefined) => string;
}

const initialState: SelectedProjectData = { id: -1, userList: [] };

const useSelectedProjectState = create<SelectedProjectState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        updateProjectData: ({ id, userList }) => set(() => ({ id: id, userList: userList })),
        deleteProjectData: () => set(initialState),
        getUserNameById(userId) {
          const { userList } = get();
          if (!userId) return '미할당';
          return userList.find((user) => user.userId === Number(userId))?.userName ?? '미할당';
        },
      }),
      {
        name: 'projectState',
      },
    ),
  ),
);

export default useSelectedProjectState;
