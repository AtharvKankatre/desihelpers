import { create } from 'zustand';

interface LoaderState {
    isLoading: boolean;
    requestCount: number;
    showLoader: () => void;
    hideLoader: () => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
    isLoading: false,
    requestCount: 0,
    showLoader: () => set((state) => ({
        isLoading: true,
        requestCount: state.requestCount + 1
    })),
    hideLoader: () => set((state) => {
        const newCount = Math.max(0, state.requestCount - 1);
        return {
            isLoading: newCount > 0,
            requestCount: newCount
        };
    }),
}));
