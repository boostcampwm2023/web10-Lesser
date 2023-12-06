import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UserType {
  id: number;
  username: string;
}

interface UserStateType extends UserType {
  updateUserState: ({ id, username }: UserType) => void;
  deleteUserState: () => void;
}

const initialState: UserType = {
  id: -1,
  username: '',
};

const useUserState = create<UserStateType>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        updateUserState: ({ id, username }) => set(() => ({ id, username })),
        deleteUserState: () => set(initialState),
      }),
      { name: 'userState' },
    ),
  ),
);

export default useUserState;
