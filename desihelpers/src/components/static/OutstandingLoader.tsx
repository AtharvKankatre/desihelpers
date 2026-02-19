import React from 'react';
import styles from '@/styles/OutstandingLoader.module.css';
import { useLoaderStore } from '@/stores/LoaderStore';

export const OutstandingLoader = () => {
    const isLoading = useLoaderStore((state) => state.isLoading);

    if (!isLoading) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.loaderContainer}>
                <div className={styles.spinner}>
                    <div className={styles.doubleBounce1}></div>
                    <div className={styles.doubleBounce2}></div>
                </div>
                <h3 className={styles.loadingText}>Loading...</h3>
            </div>
        </div>
    );
};
