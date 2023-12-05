import { create } from 'zustand';

interface UserListState {
  userId: number;
  userName: string;
}

interface SelectedProjectData {
  id: number;
  userList: UserListState[];
}

interface SelectedProjectState extends SelectedProjectData {
  updateProjectData: ({ id, userList }: SelectedProjectData) => void;
  deleteProjectData: () => void;
}

const useSelectedProjectState = create<SelectedProjectState>((set) => ({
  id: -1,
  userList: [],
  updateProjectData: ({ id, userList }) => set(() => ({ id: id, userList: userList })),
  deleteProjectData: () => set(() => ({ id: -1, userList: [] })),
}));

export default useSelectedProjectState;
