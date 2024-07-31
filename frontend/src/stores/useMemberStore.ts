import { create } from "zustand";
import { LandingMemberDTO, MemberStatus } from "../types/DTO/landingDTO";
import { createJSONStorage, persist } from "zustand/middleware";

interface InitialMemberState {
  myInfo: LandingMemberDTO;
  memberList: LandingMemberDTO[];
}

interface MemberState extends InitialMemberState {
  updateMyInfo: (newMyInfo: LandingMemberDTO) => void;
  updateMyStatus: (status: MemberStatus) => void;
  updateMemberList: (newMember: LandingMemberDTO[]) => void;
  addMember: (member: LandingMemberDTO) => void;
}

const initialState: InitialMemberState = {
  myInfo: { id: -1, username: "", imageUrl: "", status: "on" },
  memberList: [],
};

const useMemberStore = create<MemberState>()(
  persist(
    (set) => ({
      ...initialState,
      updateMyInfo: (newMyInfo) => set(() => ({ myInfo: newMyInfo })),
      updateMyStatus: (status) =>
        set((state) => ({ myInfo: { ...state.myInfo, status } })),
      updateMemberList: (newMember) => set({ memberList: newMember }),
      addMember: (member) =>
        set((state) => ({ memberList: [...state.memberList, member] })),
    }),
    { name: "member-storage", storage: createJSONStorage(() => sessionStorage) }
  )
);

export default useMemberStore;
