import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SelectedProjectData } from '../types/project';

interface SelectedProjectState extends SelectedProjectData {
  updateProjectData: ({ id, userList }: SelectedProjectData) => void;
  deleteProjectData: () => void;
}

const initialState: SelectedProjectData = { id: -1, userList: [] };

const useSelectedProjectState = create<SelectedProjectState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        updateProjectData: ({ id, userList }) => set(() => ({ id: id, userList: userList })),
        deleteProjectData: () => set(initialState),
      }),
      {
        name: 'projectState',
      },
    ),
  ),
);

export default useSelectedProjectState;
