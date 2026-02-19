import { IUserProfileModel } from "@/models/UserProfileModel";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  seeker: IUserProfileModel[];
  dateTime: number | null;
};

type Actions = {
  setSeekers: (job: IUserProfileModel[]) => void;
  setData: (date: number) => void;
  reset: () => void;
};

const initialState: State = {
  seeker: [] as IUserProfileModel[],
  dateTime: null,
};

export const seekerStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setSeekers: (seeker: IUserProfileModel[]) => {
        //console.log("Setting seekers:", seeker);
        set(() => ({ seeker }));
      },
      setData: (date: number) => {
       // console.log("Setting dateTime:", date);
        set(() => ({ dateTime: date }));
      },
      reset: () => {
        //console.log("Resetting to initial state");
        set(() => initialState);
      },
    }),
    {
      name: "seeker-storage", // Persist the state to localStorage
      storage: createJSONStorage(() => localStorage), // Optional, use localStorage explicitly
      partialize: (state) => ({ userProfile: state.seeker}), // Persist only userProfile
      onRehydrateStorage: () => (state) => {
      },
    }
  )
);


