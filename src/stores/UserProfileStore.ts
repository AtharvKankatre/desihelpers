import { IUserProfileModel } from "@/models/UserProfileModel";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  userProfile: IUserProfileModel;
};

type Actions = {
  setUserProfile: (profile: IUserProfileModel) => void;
  reset: () => void;
};

const initialState: State = {
  userProfile: {} as IUserProfileModel,
};

export const userProfileStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setUserProfile: (profile: IUserProfileModel) =>
        set(() => ({ userProfile: profile })),
      reset: () => set(() => initialState),
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => localStorage), // Optional, use localStorage explicitly
      partialize: (state) => ({ userProfile: state.userProfile }), // Persist only userProfile
    }
  )
);
