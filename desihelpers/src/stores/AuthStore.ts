import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IJobCategories } from "@/models/JobCategories";

interface AuthState {
    isActive: boolean;
    isSeeker: boolean;
    isProfileBuild: boolean;
    email: string;
    role: string;
    jobCategories: IJobCategories[];
}

interface AuthActions {
    setAuthStatus: (status: Partial<AuthState>) => void;
    setJobCategories: (categories: IJobCategories[]) => void;
    logout: () => void;
}

const initialState: AuthState = {
    isActive: false,
    isSeeker: false,
    isProfileBuild: false,
    email: "",
    role: "",
    jobCategories: [],
};

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            ...initialState,
            setAuthStatus: (status) => set((state) => ({ ...state, ...status })),
            setJobCategories: (categories) => set(() => ({ jobCategories: categories })),
            logout: () => set(() => initialState),
        }),
        {
            name: "auth-storage", // unique name for localStorage key
            storage: createJSONStorage(() => localStorage),
        }
    )
);
