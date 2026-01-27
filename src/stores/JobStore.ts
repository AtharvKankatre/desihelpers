import { IJobs } from "@/models/Jobs";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  jobs: IJobs[];
  dateTime: number | null;
};

type Actions = {
  setJobs: (job: IJobs[]) => void;
  setData: (date: number) => void;
  reset: () => void;
};

const initialState: State = {
  jobs: [] as IJobs[],
  dateTime: null,
};

export const jobStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setJobs: (jobs: IJobs[]) => set(() => ({ jobs: jobs })),
      setData: (date: number) => set(() => ({ dateTime: date })),
      reset: () => set(() => initialState),
    }),
    {
      name: "job-storage",
      storage: createJSONStorage(() => localStorage), // Optional, use localStorage explicitly
      partialize: (state) => ({ userProfile: state.jobs}),
      onRehydrateStorage: () => (state) => {
      },
    }
  )
);
