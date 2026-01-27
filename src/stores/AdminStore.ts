import { IUsers } from "@/models/UsersModel";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  users : IUsers[];
  dateTime: number | null;
};

type Actions = {
  setUserDetails: (user: IUsers[]) => void;
  setData: (date: number) => void;
  reset: () => void;
};

const initialState: State = {
  users : [] as IUsers[],
  dateTime: null,
};

export const adminStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setUserDetails: (users: IUsers[]) => set(() => ({ users: users })),
      setData: (date: number) => set(() => ({ dateTime: date })),
      reset: () => set(() => initialState),
    }),
    {
      name: "admin-storage",
      storage: createJSONStorage(() => localStorage), // Optional, use localStorage explicitly
      partialize: (state) => ({ userProfile: state.users}),
      onRehydrateStorage: () => (state) => {
      },
    }
  )
);
